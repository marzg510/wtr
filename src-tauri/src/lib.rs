use sqlx::{Pool, Sqlite, sqlite::SqlitePoolOptions, Error, Executor};

#[derive(Debug, sqlx::FromRow)]
struct MyData {
    id: i32,
    name: String,
}

pub struct Database {
    pool: Pool<Sqlite>,
}

impl Database {
    pub async fn new(db_url: &str) -> Result<Database, Error> {
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(db_url)
            .await?;

        Ok(Database { pool })
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

#[cfg(test)]
mod tests {
    use super::*;
    const DATABASE_URL : &str = "sqlite::memory:";
    struct TestContext {
        db: Database,
    }
    // let data = MyData { id: 1, name: "example".to_string() };
    // fn setup() -> TestContext {
    //     println!("Test setup ...");
    //     TestContext {
    //         db: Database::new(database_url),
    //     }
    // }

    #[test]
    fn test_db_new() {
        let db = Database::new(DATABASE_URL);
        // println!("db: {:?}", db);
        let y = {
            let x = 3;
            x + 1
        };
        println!("The value of y is: {:?}", y);
        // let str = match db {
            // Ok(database) => "ok",
            // Err(err) => "ng",
        // };
        // println!("result {}", str);
        // println!("OK(db): {:?}", Ok(db));
        // assert_eq!(2+2, 4);
        assert!(false);
    }
}


// db.insert_data(&data).unwrap();
// let result = db.get_data_by_id(1).unwrap();
// println!("Result: {:?}", result);