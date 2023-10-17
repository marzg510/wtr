// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use chrono::{NaiveDate, DateTime, Local};

// pub(crate) mod main;

// #[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
#[derive(Debug, Serialize, Deserialize)]
pub struct Work {
    id: i64,
    work_date: NaiveDate,
    start_time: DateTime<Local>,
    end_time: DateTime<Local>,
    work: String,
    project_id: Option<i64>,
    task: Option<String>
}
impl Work {
    pub fn new(id: i64, work_date: NaiveDate, start_time: DateTime<Local>, end_time: DateTime<Local>, work: String, project_id: Option<i64>, task: Option<String>) -> Self {
        Work {
            id,
            work_date,
            start_time,
            end_time,
            work,
            project_id,
            task
        }
    }
}

// workを取り出すハンドラ
#[tauri::command]
fn get_work() -> Result<Work, String> {
    let work: Work = Work::new(100, NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(), Local::now(), Local::now(), "test".to_string(), None, None);
    Ok(work)
}
/// workの追加直後に呼ばれるハンドラ
#[tauri::command]
async fn handle_add_work(work: Work) -> Result<(), String> {
    // IPCで受信したデータをデバッグ表示する
    println!("handle_add_work ----------");
    dbg!(&work);
    Ok(())
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            handle_add_work,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
