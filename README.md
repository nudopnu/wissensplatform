__Einen neuen Nutzer zur docker group hinzufügen__
```bash
sudo usermod -aG docker $USER
newgrp docker

# testen mit
docker pull registry.gitlab.rlp.net/xr-lab/izit-plattform/server:latest
```

__Bei updates__

Bei jedem Push auf den `main`-Branch wird das Image in der [Container-Registry](https://gitlab.rlp.net/xr-lab/izit-plattform/container_registry) aktualisiert. Dies muss manuell geholt werden:

```bash
docker compose pull
docker compose up -d
```