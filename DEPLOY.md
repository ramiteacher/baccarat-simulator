# GitHub Pages 배포 가이드

## 자동 배포 설정

이 프로젝트는 GitHub Pages로 자동 배포되도록 설정되어 있습니다.

### 배포 URL
```
https://ramiteacher.github.io/baccarat-simulator/
```

### 배포 프로세스

1. **main 브랜치에 푸시**
   ```bash
   git push origin main
   ```

2. **GitHub Actions 실행**
   - 푸시 후 자동으로 GitHub Actions 워크플로우가 실행됩니다
   - 빌드 및 배포가 자동으로 진행됩니다

3. **배포 상태 확인**
   - GitHub 리포지토리 → Actions 탭에서 배포 상태 확인
   - 배포 완료 후 위의 배포 URL에서 접속 가능

### 수동 배포

만약 자동 배포가 작동하지 않는 경우:

```bash
# 1. 로컬에서 빌드
pnpm build

# 2. dist 폴더를 gh-pages 브랜치에 배포
pnpm install -D gh-pages
npx gh-pages -d dist
```

### 배포 설정 확인

GitHub 리포지토리 설정에서:
1. Settings → Pages
2. Build and deployment 섹션에서:
   - Source: Deploy from a branch
   - Branch: gh-pages / (root)

### 주의사항

- `vite.config.ts`의 `base` 설정이 `/baccarat-simulator/`로 설정되어 있습니다
- 이는 GitHub Pages의 리포지토리 이름 기반 URL 구조를 따릅니다
- 커스텀 도메인을 사용하려면 CNAME 파일을 추가해야 합니다

### 커스텀 도메인 설정

1. `public/CNAME` 파일 생성:
   ```
   yourdomain.com
   ```

2. DNS 설정에서 GitHub Pages IP 주소 추가:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. 또는 CNAME 레코드 추가:
   ```
   CNAME  yourdomain.com  ramiteacher.github.io
   ```

### 문제 해결

**배포가 실패하는 경우:**
- GitHub Actions 로그 확인: Actions 탭 → 실패한 워크플로우 클릭
- `pnpm install`이 성공했는지 확인
- `pnpm build`가 로컬에서 성공하는지 확인

**페이지가 로드되지 않는 경우:**
- 브라우저 캐시 삭제 후 새로고침
- 배포 URL이 정확한지 확인 (base 경로 포함)
- GitHub Pages 설정에서 배포 상태 확인

### 배포 후 테스트

배포 완료 후:
1. 배포 URL 접속
2. 게임이 정상 작동하는지 확인
3. 모든 기능(카드 쪼기, 사운드, 배팅) 테스트

---

**배포 URL**: https://ramiteacher.github.io/baccarat-simulator/
