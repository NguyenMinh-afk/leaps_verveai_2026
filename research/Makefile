.PHONY: help install test test-a test-b test-unit lint clean

help:
	@echo "NEKOPATH Research — Make targets"
	@echo "  install    Cài đặt research package (editable)"
	@echo "  test       Chạy tất cả pytest"
	@echo "  test-a     Chạy Bài kiểm A (cần data/)"
	@echo "  test-b     Chạy Bài kiểm B (cần measurements từ thiết bị thật)"
	@echo "  test-unit  Chỉ chạy unit test trong tests/"
	@echo "  lint       Ruff (nếu cài)"
	@echo "  clean      Xoá __pycache__, .pytest_cache, dist/"

install:
	pip install -e ".[dev]"

test:
	pytest

test-unit:
	pytest tests/ -v

# Bài kiểm A — cần dữ liệu trong data/.
# Trong CI/CD, cung cấp dữ liệu qua mount hoặc PR build.
test-a:
	python -m research.model_eval test_a \
	    --attempts data/attempts.csv \
	    --gold data/gold \
	    --llm data/llm_predictions.csv \
	    --out reports/test_a_$$(date +%Y%m%d_%H%M%S).json

# Bài kiểm B — cần measurements.csv từ thiết bị thật.
test-b:
	python -m research.model_eval test_b \
	    --device data/device.json \
	    --measurements data/measurements.csv \
	    --out reports/test_b_$$(date +%Y%m%d_%H%M%S).json

lint:
	ruff check src tests || true

clean:
	rm -rf src/**/__pycache__ tests/__pycache__ .pytest_cache reports/*.json
	find . -type d -name "__pycache__" -prune -exec rm -rf {} +