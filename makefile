IMAGE := ghcr.io/jxc2000-b/track3-app
TAG ?= latest

push-image:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		-t $(IMAGE):$(TAG) \
		--push .