#!/usr/bin/env bash
set -e

pip install --upgrade pip
pip install -r backend/requirements.txt

python backend/manage.py collectstatic --noinput
