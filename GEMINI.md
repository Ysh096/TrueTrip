# ✈️ TrueTrip AI Development Guidelines

이 문서는 TrueTrip 프로젝트의 AI 어시스턴트 및 개발자를 위한 핵심 가이드라인입니다. 모든 작업은 본 가이드를 최우선으로 준수해야 합니다.

---

## 🏗 1. Architectural Principles (DDD & Hexagonal)

우리는 **도메인 주도 설계(DDD)**와 **헥사고날 아키텍처(Hexagonal Architecture)**를 따릅니다.

- **Layer Separation:**
    - `domain`: 순수 비즈니스 로직 및 모델. 외부 프레임워크(Spring, JPA) 의존성 금지.
    - `application`: 유스케이스 구현. 인터페이스(Port)를 통해 외부와 소통.
    - `infrastructure`: 실제 구현체(Adapter). DB, API, 외부 라이브러리 연동.
    - `interfaces`: 프레젠테이션 계층. API 엔티티 및 컨트롤러.
- **Dependency Flow:** 의존성은 항상 안쪽(도메인)으로 향해야 합니다. (Port-Adapter 패턴 활용)
- **Object Mapping:** JpaEntity, Domain Model, DTO는 엄격히 분리하고 매핑을 통해 변환합니다.

## 🧠 2. "Plan-then-Execute" Methodology

모든 코드 수정 전에는 반드시 다음 단계를 거칩니다.

1.  **Context Analysis:** 관련 파일 구조와 코드를 충분히 읽고 의존성을 파악합니다.
2.  **Strategy Proposal:** 
    - 무엇을 바꿀 것인가? (What)
    - 왜 그렇게 바꾸는가? (Why)
    - 아키텍처에 미치는 영향은 무엇인가? (Impact)
3.  **Step-by-Step Plan:** 작업을 원자적(Atomic) 단위로 나누어 순서를 정의합니다.
4.  **Implementation:** 승인된 계획에 따라 코드를 작성합니다.
5.  **Verification:** 빌드 성공 확인 및 유닛 테스트 실행을 필수로 합니다.

## 💻 3. Technical Standards

### Backend (Kotlin/Spring Boot)
- **Language:** Kotlin (Idiomatic Kotlin 사용, `data class`, `val` 우선).
- **Style:** 명확한 패키지 구조 준수. 서비스 계층은 인터페이스(Port)에 의존.
- **Error Handling:** `ApiResponse` 공통 래퍼를 사용한 일관된 응답 제공.

### Frontend (Next.js/TypeScript)
- **App Router:** `src/app` 구조 및 Server/Client Component의 명확한 분리.
- **Tailwind CSS v4:** 새로운 `@import "tailwindcss";` 방식 및 모던 유틸리티 사용.
- **Component Design:** 비즈니스 로직(lib/api)과 UI(components)의 엄격한 분리.

## ⚠️ 4. Critical Constraints & Caution

- **No Silent Failures:** 에러 발생 시 로그를 남기고 적절한 예외 처리를 수행합니다.
- **Keep it Clean:** 불필요한 주석은 지양하고, 코드 자체로 설명 가능한 클린 코드를 작성합니다.
- **Build First:** 코드 변경 후에는 항상 `clean build`를 통해 사이드 이펙트를 확인합니다.
- **Documentation:** 주요 아키텍처 변경 시 `DEVELOPMENT_CONTEXT.md`를 업데이트합니다.

---
**"계획 없는 코딩은 부채를 쌓는 일입니다. 먼저 생각하고, 그 다음 코드를 작성하세요."**
