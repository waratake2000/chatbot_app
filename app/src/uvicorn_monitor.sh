#!/bin/bash

# Uvicornサーバーの起動コマンド
start_server() {
    uvicorn main:app --host 0.0.0.0 --reload
}

# 死活監視を行う関数
monitor_process() {
    while true; do
        # Uvicornプロセスをgrepで検索
        if ! pgrep -f "uvicorn main:app --host 0.0.0.0 --reload" > /dev/null; then
            echo "Uvicornプロセスが見つかりません。サーバーを再起動します。"
            # サーバーの起動関数を呼び出し
            start_server
        else
            echo "Uvicornサーバーは正常に稼働しています。"
        fi
        # 10秒ごとにチェック
        sleep 3
    done
}

# サーバーの起動と死活監視を開始
start_server &
monitor_process
