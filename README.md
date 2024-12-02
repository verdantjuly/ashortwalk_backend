<img src="https://github.com/user-attachments/assets/e11880de-7f4c-428d-9ee8-bac6a70e0efd" width="200" height="200">

# 짧은 산책 Backend

일상을 한 걸음 앞으로, 산책 커뮤니티 “ 짧은 산책 “ 입니다.

- 배포 주소 : [바로가기](https://ashortwalk-gkd3dvdpfcexb0ce.koreacentral-01.azurewebsites.net/)

# 👟 TEAM

- 팀 명  
  zeroeqaulszero (영은영)
- 팀원 소개  
  | 이름 | 백엔드 담당 기능 |
  | ----- | ------------------- | 
  | 이다영 | 산책 경로 추천, 산책 성향 통계, 채팅, 관리자, 게시판, 댓글, 유저, 신고 |
  | 한영희 | 피드 |
  | 조은혜 | 그룹 |
 

- 개발 일정  
  2024년 11월 19일 ~ 2024년 12월 2일 (2주)

- 개발 과정  

  [마일스톤](https://docs.google.com/spreadsheets/d/1SSaSrOxuqmxmiVsNv_Pw6xuxpjbTNivPiRzatUcC_YY/edit?gid=0#gid=0)

# 🏃‍♀️ Project

- 프로젝트 명  
  - 짧은산책(ashortwalk)  
- 프로젝트 목적  
  - 산책 커뮤니티  
  - 은둔 청년, 독거 노인 등 소외 계층을 위한 웹 서비스.  
- 프로젝트 주요 기능  
  - Azure AI 서비스를 활용한 음성 인식과 산책 경로 추천, 지도 제공  
  - 게시글 작성 카테고리 분류에 따른 산책 성향 통계  
  - 카카오 소셜 로그인  
  - 실시간 채팅  
  - 게시판, 피드, 그룹, 신고    

# ✒️ Coding Convention   

- 변수, 클래스, 함수 네이밍  
  - 변수 : 카멜케이스, const, let (var X), 명명 시 진지하게 고민  
  - 클래스 : 클래스명 첫 글자는 대문자   

# 💻 Tech Spec

- 프로젝트 : Nest.js
- DB : PostgreSQL, Redis
- ORM : TypeORM
- 채팅 : Socket.io
- 로그인 : KAKAO API, Passport, nodemailer, JWT, Argon2
- 이미지 업로드 : Azure Storage (Container, Blob), Sharp (리사이징, webp 변환)
- 배포 : Azure App Services (CI/CD - 포크된 리더 개인 레포지토리에서 진행)  

# 📋 API

[User API 명세서](https://suave-prawn-3cc.notion.site/Users-API-12d244ea9138809c8e4ece1de5b1d1d6)

[Posts API 명세서](https://suave-prawn-3cc.notion.site/Posts-API-12e244ea9138805c86eff064a9e4bc48)

[Comments API 명세서](https://suave-prawn-3cc.notion.site/Comments-API-12f244ea913880a88945e9492bc1ce93)

[Reports API 명세서](https://suave-prawn-3cc.notion.site/Reports-API-12f244ea9138806a86cce9f048ea504a)

# 📔 ERD

![erd](https://github.com/user-attachments/assets/39d203af-db06-4ddb-803f-9abba658c61a)


# ⛏️ Project Architecture

<img width="984" alt="architecture" src="https://github.com/user-attachments/assets/052e0019-9746-4b02-b0cb-5dd90bd3e888">

