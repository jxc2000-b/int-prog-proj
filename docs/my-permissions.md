## My permissions are
create namespace: no
create secrets: no
get secrets: no 
create statefulsets: yes
create services: yes
create persistentvolumeclaims: yes

useful commands:
# create and run a test postgres-client (make sure to delete when done):
```

kubectl run postgres-client \
  --restart=Never \
  --image=postgres:16-alpine \
  --env PGPASSWORD='your-db-password' \
  --command -- \
  psql -h postgres -U appuser -d appdb -c 'SELECT version();'
```

# check logs after: 
```
kubectl logs postgres-client 
```

# delete pod: 
```
kubectl delete pod postgres-client 
```
## Useful commands:

# Set env vars:
set -a
source .env
set +a