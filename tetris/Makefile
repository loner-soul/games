include .env.main
include .env.local

BUILD_DIR := "./dist"
ZIP_NAME :=  "dist"

CHECK_BUILD_DIRT := $(shell if [ -d "dist" ]; then echo "1"; else echo "0"; fi)

.PHONY: all docker-build docker-run build-dist zip push clean help
	
all: help

clean: ## 清理缓存
	rm -rf $(BUILD_DIR)

help: ## 显示帮助
	@./help.sh Makefile

docker-build: ## 构建一个docker镜像
	- docker rmi tetris:latest
	docker build -t tetris -f Dockerfile .

docker-run: ## 运行一个docker容器
	- docker stop html-tetris
	docker run  -d --rm -p 9500:80 --name html-tetris tetris:latest

build-dist: ## 打包到dist目录
	mkdir -p $(BUILD_DIR)
	cp -r static $(BUILD_DIR)/
	cp index.html $(BUILD_DIR)/	

zip: ## 压缩dist目录
	zip -r $(ZIP_NAME).zip $(BUILD_DIR)

push: ## 推送dist到服务器
ifeq ($(CHECK_BUILD_DIRT),0)
	$(error "Missing directory $(BUILD_DIR), you should run `make build-dist` at first")
endif

ifndef $(TS_NAME)
	$(error "Missing env variable `TS_NAME`")
endif

ifndef $(TS_ADDR)
	$(error "Missing env variable `TS_ADDR`")
endif

ifndef $(TS_DIR)
	$(error "Missing env variable `TS_DIR`")
endif
	scp -r $(BUILD_DIR) $(TS_NAME)@$(TS_ADDR):$(TS_DIR)
