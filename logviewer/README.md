- 根据Dockerfile,创建一个image

```
docker build -t logviewer-docker .
```

- 运行image, 生成一个container

```
docker run --name my-logviewer -p 80:9090 logviewer-docker
```

- 删除image

```
docker rmi logviewer-docker
```

- 查询image

```
docker images
```