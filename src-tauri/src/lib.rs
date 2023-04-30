use std::{str::FromStr};
use sqlx::{Pool, Sqlite, 
    sqlite::{SqlitePoolOptions, SqliteConnectOptions, SqliteJournalMode, SqliteSynchronous},
    Error, Executor, SqlitePool, Transaction
};

#[derive(Debug, sqlx::FromRow)]
struct MyData {
    id: i32,
    name: String,
}

#[derive(Debug)]
pub struct Database {
    pool: Pool<Sqlite>,
}

impl Database {
    pub async fn new(db_url: &str) -> Result<Database, Error> {
        // let pool = SqlitePoolOptions::new()
        //     .max_connections(5)
        //     .connect(db_url)
        //     .await?;

        // Ok(Database { pool })
        // コネクションの設定
        let connection_options = SqliteConnectOptions::from_str(db_url)?
            // DBが存在しないなら作成する
            .create_if_missing(true)
            // トランザクション使用時の性能向上のため、WALを使用する
            .journal_mode(SqliteJournalMode::Wal)
            .synchronous(SqliteSynchronous::Normal);
    
        // 上の設定を使ってコネクションプールを作成する
        let sqlite_pool = SqlitePoolOptions::new()
            .connect_with(connection_options)
            .await?;

        Ok(Database { pool: sqlite_pool })
    }

    // pub async fn get_data_by_id(&self, id: i32) -> Result<Option<MyData>, Error> {
    //     let rec = sqlx::query_as::<_, MyData>("SELECT * FROM my_table WHERE id = ?", id)
    //         .fetch_optional(&self.pool).await?;
    //         // let user_results = sqlx::query_as::<_, User>("SELECT id, name, lastname, active FROM users")
    //         // .fetch_all(&db)
    //         // .await
    //         // .unwrap();


    //     Ok(rec)
    // }
    

    // pub async fn insert_data(&self, id: i32, name: &str) -> Result<(), Error> {
    //     let mut tx = self.pool.begin().await?;
    //     tx.execute("INSERT INTO my_table (id, name) VALUES (?, ?)", id, name)
    //         .await?;
    //     tx.commit().await?;

    //     Ok(())
    // }
}

/// このモジュール内の関数の戻り値型
type DbResult<T> = Result<T, Box<dyn std::error::Error>>;


/// SQLiteのコネクションプールを作成して返す
pub(crate) async fn create_sqlite_pool(database_url: &str) -> DbResult<SqlitePool> {
    // コネクションの設定
    let connection_options = SqliteConnectOptions::from_str(database_url)?
        // DBが存在しないなら作成する
        .create_if_missing(true)
        // トランザクション使用時の性能向上のため、WALを使用する
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal);

    // 上の設定を使ってコネクションプールを作成する
    let sqlite_pool = SqlitePoolOptions::new()
        .connect_with(connection_options)
        .await?;

    Ok(sqlite_pool)
}

/// マイグレーションを行う
pub(crate) async fn migrate_database(pool: &SqlitePool) -> DbResult<()> {
    sqlx::migrate!("./migrations").run(pool).await?;
    Ok(())
}

async fn insert_my_table(
    tx: &mut Transaction<'_, Sqlite>,
    id: i32,
    name: &str,
) -> DbResult<()> {
    sqlx::query("INSERT INTO my_table (id, name) VALUES (?, ?)")
        .bind(id)
        .bind(name)
        .execute(&mut *tx)
        .await?;

    Ok(())
}


#[cfg(test)]
mod tests {
    use super::*;
    const DATABASE_URL : &str = "sqlite::memory:";
    struct TestContext {
        db: Pool<Sqlite>,
    }
    // let data = MyData { id: 1, name: "example".to_string() };
    fn setup() -> TestContext {
        println!("Test setup ...");
        use tauri::async_runtime::block_on;
        let db = block_on(create_sqlite_pool(DATABASE_URL)).unwrap();
        let result = block_on(migrate_database(&db));

        TestContext {
            db: db,
        }
    }

    #[test]
    fn test_create_sqlite_pool() {
        use tauri::async_runtime::block_on;
        setup();
        let db = block_on(create_sqlite_pool("sqlite::memory:"));
        println!("db: {:?}", db);
        assert!(db.is_ok());
    }
    #[test]
    fn test_insert_my_table() {
        use tauri::async_runtime::block_on;
        // トランザクションを開始する
        let context = setup();
        let pool = context.db;
        let mut tx = block_on(pool.begin()).unwrap();
        let result = block_on(insert_my_table(&mut tx, 1, "test01"));
        assert!(result.is_ok());
        // トランザクションをコミットする
        let result = block_on(tx.commit());
        assert!(result.is_ok());
    }
}


// db.insert_data(&data).unwrap();
// let result = db.get_data_by_id(1).unwrap();
// println!("Result: {:?}", result);