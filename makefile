IMAGE := ghcr.io/jxc2000-b/track3-app
TAG ?= dev
PLATFORM ?= linux/amd64
NAMESPACE ?=
NS_FLAG := $(if $(NAMESPACE),-n $(NAMESPACE),)

.PHONY: push-image prisma-migrate prisma-resolve prisma-seed postgres-check

push-image:
	docker buildx build \
		--platform $(PLATFORM) \
		-t $(IMAGE):$(TAG) \
		--push .

prisma-migrate: 
	kubectl $(NS_FLAG) run prisma-migrate \
	--restart=Never \
	--image="$(IMAGE):$(TAG)" \
	--image-pull-policy=Always \
	--env DATABASE_URL="$(DATABASE_URL)" \
	--command -- \
	pnpm prisma migrate deploy

prisma-resolve: 
	kubectl $(NS_FLAG) run prisma-resolve \
	--restart=Never \
	--image="$(IMAGE):$(TAG)" \
	--image-pull-policy=Always \
	--env DATABASE_URL="$(DATABASE_URL)" \
	--command -- \
	pnpm prisma migrate resolve --rolled-back $(MIGRATION)

prisma-seed: 
	kubectl $(NS_FLAG) run prisma-seed \
	--restart=Never \
	--image="$(IMAGE):$(TAG)" \
	--image-pull-policy=Always \
	--env DATABASE_URL="$(DATABASE_URL)" \
	--command -- \
	pnpm prisma db seed

postgres-check: 
	kubectl $(NS_FLAG) run postgres-check \
	--restart=Never \
	--image=postgres:16-alpine \
	--env PGPASSWORD="$(PGPASSWORD)" \
	--command -- \
	psql -h postgres -U appuser -d appdb -c '$(QUERY);'
