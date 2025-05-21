# Dockerfile

# 기본 이미지로 최신 안정 버전의 Nginx (Alpine Linux 기반으로 가벼움) 사용
FROM nginx:stable-alpine

# 로컬의 nginx.conf 파일을 컨테이너의 Nginx 설정 디렉토리로 복사
# 기본 설정 파일을 덮어쓰거나, conf.d 디렉토리에 추가할 수 있습니다.
# 여기서는 conf.d에 추가하여 기존 설정을 유지하고 우리 설정을 추가합니다.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# (선택 사항) 정적 파일을 직접 Nginx가 서빙해야 하는 경우, 해당 파일을 복사합니다.
# 예: COPY ./static-html /usr/share/nginx/html

# Nginx가 80 포트를 노출하도록 명시 (실제 포트 매핑은 docker run 명령어에서 수행)
EXPOSE 80

# 컨테이너 시작 시 Nginx 실행 명령어
CMD ["nginx", "-g", "daemon off;"]