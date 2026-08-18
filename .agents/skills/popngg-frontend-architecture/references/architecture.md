# popn.gg 단일 앱 아키텍처

이 문서는 모노레포를 단일 React Router Framework 앱으로 통합할 때 사용할 **기본 구조와 판단 기준**을 기록한다. 모든 폴더를 기계적으로 강제하려는 문서가 아니라, 새 코드를 어디에서 시작하고 언제 공용으로 승격할지 결정하기 위한 실무 기준이다.

## 목차

- [목표](#목표)
- [기본 의존성 방향](#기본-의존성-방향)
- [목표 디렉터리](#목표-디렉터리)
- [route slice의 책임](#route-slice의-책임)
- [API, domain, UI의 경계](#api-domain-ui의-경계)
- [실행 환경과 Cloudflare 경계](#실행-환경과-cloudflare-경계)
- [데이터 로딩과 mutation](#데이터-로딩과-mutation)
- [table feature](#table-feature)
- [domain과 schema를 함께 쓰는 법](#domain과-schema를-함께-쓰는-법)
- [공통 코드 승격 기준](#공통-코드-승격-기준)
- [UI 배치](#ui-배치)
- [오류 처리](#오류-처리)
- [의존성 경계 검증](#의존성-경계-검증)
- [route slice 검토 기준](#route-slice-검토-기준)
- [새 코드를 추가할 때의 짧은 체크리스트](#새-코드를-추가할-때의-짧은-체크리스트)

## 목표

- 하나의 React Router Framework 앱에서 라우트와 화면의 책임을 가깝게 유지한다.
- 한 URL에 필요한 UI·상태·서버 연동을 하나의 vertical slice에서 찾을 수 있게 한다.
- 백엔드 DTO가 화면까지 새지 않도록 `api → domain → ui` 경계를 유지한다.
- 테이블처럼 여러 화면에서 반복되는 사용자 동작은 feature로 재사용한다.
- 작은 공통 코드까지 미리 추상화하지 않고, 실제 재사용이 확인될 때만 아래 레이어로 승격한다.

## 기본 의존성 방향

```text
route slice → widget → feature → entity → shared
```

위 방향을 기본으로 삼는다. 같은 레이어의 슬라이스끼리 직접 의존하지 않으며, 순환 의존성은 허용하지 않는다.

`widget`은 여러 route가 공유하는 완성형 화면 영역을 조합하는 예외적인 상위 레이어다. 공용 UI와 feature를 조합할 수 있지만 route slice를 import하지 않으며, 구체적인 URL·문구·화면 데이터는 호출부가 전달한다. 재사용 가능한 상호작용이나 도메인 규칙 자체를 widget에 넣지 않는다.

다만 이 규칙은 금지 목록이 아니라 기본값이다. 작은 코드가 한 화면에서만 쓰이고 별도 레이어를 만들면 오히려 읽기 어려워진다면 route slice 안에 둔다. 반대로 실제 두 번째 소비처가 생기면 그때 가장 낮은 적절한 레이어로 승격한다.

### 지켜야 하는 최소 경계

- route가 받은 `loaderData`와 컴포넌트가 다루는 값은 가능하면 domain 타입이어야 한다.
- 백엔드 DTO와 wire-level code는 `api` 안에서만 해석한다.
- route slice가 다른 route slice를 import하지 않는다.
- feature가 특정 페이지의 URL이나 레이아웃을 알지 않는다.
- entity는 여러 화면에서 공유할 수 있는 개념과 규칙만 가진다.

## 목표 디렉터리

```text
app/
├── root.tsx                    # 문서 구조, 전역 provider, 전역 오류
├── routes.ts                   # React Router route tree
├── routes/
│   ├── app/
│   │   ├── route.tsx            # 로그인 후 앱 셸 layout route
│   │   └── ui/                  # header, footer 등 앱 셸 UI
│   ├── home/
│   │   ├── route.tsx
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── users/
│   │   ├── route.tsx
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── user/
│   │   ├── route.tsx            # /user/:userId 부모 layout
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── user.home/
│   │   └── route.tsx            # /user/:userId
│   ├── user.records/
│   │   ├── route.tsx            # /user/:userId/records
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   └── user.progress/
│       ├── route.tsx            # /user/:userId/progress
│       └── ui/
├── features/
│   ├── auth/
│   └── table/
├── widgets/
│   └── focus-header/          # 여러 독립 route가 공유하는 화면 영역
├── entities/
│   ├── user/
│   ├── medal/
│   ├── score/
│   └── ...
└── shared/
    ├── api/
    ├── cookie/
    ├── i18n/
    ├── lib/
    └── ui/
```

`routes/`의 실제 폴더는 flat하게 유지하고 `user.progress/`처럼 점(`.`)으로 이름을 구분한다. 이것은 파일을 찾기 위한 배치 규칙이다. React Router의 `routes.ts`에서는 필요한 경우 부모와 자식의 중첩 관계를 계속 선언한다. 즉, **물리적 폴더는 flat하고 라우트 트리는 의미에 따라 nested**할 수 있다.

중첩이 필요한 경우는 부모 layout, 공통 loader, error boundary, `<Outlet>`이 실제로 필요할 때다. URL을 예쁘게 보이게 하려고 중첩하지 않는다.

## route slice의 책임

각 route slice의 `route.tsx`는 React Router와 화면을 연결하는 진입점이다.

```tsx
import type { Route } from './+types/user.records';
import { userRecordsQuery } from './api/...';
import { UserRecordsPage } from './ui/...';

export async function loader({ request, params }: Route.LoaderArgs) {
  return userRecordsQuery.loaderData({ request, userId: params.userId });
}

export default UserRecordsPage;
```

실제 프로젝트에서는 이름과 파일을 더 적절하게 나눌 수 있지만, 책임은 다음처럼 유지한다.

- `route.tsx`: `loader`, `action`, `meta`, `ErrorBoundary`, route component 연결
- `api/`: 해당 URL에만 필요한 endpoint, DTO, mapper, query options
- `model/`: 해당 화면의 domain 조합 타입, 상태, 탭/표시 규칙
- `ui/`: 화면 진입점과 화면 내부 UI
- `lib/`: 해당 route slice에서만 쓰는 순수 helper

작은 route는 `route.tsx` 하나로 시작해도 된다. 실제 코드가 늘어난 뒤 `api`, `model`, `ui`, `lib`를 만든다. 빈 폴더나 의미 없는 `index.ts`를 먼저 만들지 않는다.

### 부모·자식 route

`user` 부모 route는 프로필 헤더, 탭 내비게이션, 공통 user 식별자처럼 실제로 공유되는 셸만 소유한다. `user.records`와 `user.progress`는 각자 자신의 데이터·테이블·URL 상태를 소유한다.

자식 route가 부모 route의 내부 model이나 query를 직접 import하지 않게 한다. 부모 loader의 결과가 자식 화면에 필요한 공식 계약이라면 React Router의 `loaderData`/`useRouteLoaderData` 등 route 경계를 통해 전달한다.

## API, domain, UI의 경계

### DTO와 mapper

백엔드 계약은 route slice나 entity의 `api/`에 둔다.

```text
routes/user.records/api/
├── dto.ts                # 백엔드 이름과 code 그대로
├── get-user-records.ts   # HTTP/query 함수
├── mapper.ts             # DTO → domain
└── queries.ts            # React Query queryOptions
```

```ts
type UserRecordDto = {
  medal_code: number;
  score: number;
};

function toUserRecord(dto: UserRecordDto): UserRecord {
  return {
    medal: medal.from(dto.medal_code),
    score: dto.score,
  };
}
```

컴포넌트는 `medal_code`를 직접 해석하지 않는다. `entities/medal`이 `medal.from(code)`, `medal.color(value)` 같은 domain API를 제공하고 화면은 그 API를 사용한다.

### endpoint를 어디에 둘까?

판단은 endpoint의 URL이 아니라 **누가 그 데이터와 의미를 소유하는가**로 한다.

| 상황 | 위치 | 예시 |
|---|---|---|
| 한 화면에서만 쓰는 endpoint | 해당 route slice `api/` | `routes/user.records/api/get-user-records.ts` |
| 여러 화면이 같은 도메인 자원을 조회 | `entities/<domain>/api/` | `entities/user/api/get-user.ts` |
| 로그인, 갱신처럼 여러 화면의 사용자 동작 | `features/auth/api/` | `features/auth/api/renew-session.ts` |
| HTTP client, query client, 공통 에러 처리 | `shared/api/` | `shared/api/http.ts` |

예를 들어 `/user/:id` 헤더와 `/users` 목록이 모두 최소 User(`id`, `name`, `avatarUrl`)를 필요로 하면 `entities/user/api`로 승격한다. 반면 프로필 화면에만 필요한 `clearSummaries` 조합은 `routes/user/api`에 남긴다.

## 실행 환경과 Cloudflare 경계

이 앱의 SSR 서버는 Cloudflare Worker에서 실행된다. `route.tsx`는 loader/action 같은 서버 export와 화면 component 같은 클라이언트 export를 함께 가지는 특수한 모듈이므로 파일 자체에 `.server` 또는 `.client`를 붙이지 않는다. React Router가 서버 export를 클라이언트 번들에서 제거하지만, 서버 전용 기능은 별도 모듈로 표시하여 잘못된 import가 빌드 단계에서 드러나게 한다.

### server-only 규칙

- `cloudflare:workers`, binding, secret, 서버 전용 인증·cookie 처리에 직접 접근하는 코드는 `*.server.ts` 또는 `.server/` 안에 둔다.
- 한 route에서만 사용하는 서버 연동은 해당 slice의 `api/*.server.ts`에 둔다.
- 여러 slice가 공유하는 Cloudflare runtime adapter나 서버 HTTP client는 `shared/api/*.server.ts`에 둔다.
- `route.tsx`의 loader/action은 server module을 import할 수 있지만, `ui/`, 브라우저에서 실행되는 `model/`, `clientLoader`/`clientAction`은 import하지 않는다.
- loader/action은 binding 객체, secret, 내부 client를 반환하지 않고 UI에 필요한 직렬화 가능한 안전한 값만 반환한다.
- `worker-configuration.d.ts`는 Wrangler가 생성하는 파일이므로 직접 수정하지 않는다. binding 변경은 Wrangler 설정을 수정한 뒤 type generation으로 반영한다.

```text
app/
├── shared/api/cloudflare.server.ts
└── routes/user.records/
    ├── route.tsx
    ├── api/
    │   ├── get-user-records.server.ts
    │   ├── mapper.ts
    │   └── queries.ts
    └── ui/...
```

`api/`는 책임의 경계이지 실행 환경의 표시가 아니다. 특히 hydration 이후에도 React Query가 실행하는 query function은 브라우저에서 안전해야 하므로 server module을 import하면 안 된다. 같은 query options를 서버 prefetch와 브라우저 refetch에 모두 사용한다면 query function도 양쪽 환경에서 실행 가능해야 한다. private binding이 필요한 조회는 loader/action이나 같은 origin의 resource route 같은 서버 경계를 통해 노출한다.

## 데이터 로딩과 mutation

앱은 SSR을 기본으로 한다. URL에 의해 결정되는 첫 화면 데이터는 route `loader`에서 읽고, 필요한 경우 React Query cache를 prefetch/dehydrate하여 hydration한다.

```text
초기 요청
  → route loader가 URL 파싱
  → queryOptions로 서버 데이터 prefetch
  → SSR HTML + dehydrated cache
  → 브라우저에서 React Query hydration
```

초기 렌더 이후의 table filter, sort, pagination은 `nuqs`와 `features/table`이 URL을 소유한다. URL 변경은 shallow하게 처리하고, query key가 바뀌면 React Query가 새 데이터를 요청한다. 이 상태는 route가 직접 조립하지 않고 table config에 선언한다.

구분은 다음처럼 한다.

- 화면 진입에 필요한 데이터: route `loader`/React Query prefetch
- URL 기반 조회 상태: `features/table` + Nuqs binding
- 서버 mutation과 redirect/cookie 변경: route `action` 또는 `clientAction`
- 화면에 남아야 하는 local mutation: React Query `useMutation`
- 단순 UI 열림/닫힘: 해당 route slice 또는 feature의 local state

`useEffect`에서 route 데이터를 직접 fetch하지 않는다. loader/action과 query cache를 우선 사용한다.

## table feature

검증을 마친 `popngg-table` 구현은 제품 앱의 `features/table`이 source of truth가 된다. 별도 `packages/table`과 `packages/url-state`를 장기적으로 유지하지 않는다.

페이지는 table을 구현하지 않고, 재사용 재료를 선언한 뒤 조립한다.

```ts
// routes/user.records/model/table-config.ts
export const userRecordsTableConfig = createTableConfig({
  form: {
    version: versionField,
    difficulty: difficultyField,
    level: levelField,
  },
  sort: {
    initial: { key: 'score', order: 'desc' },
    options: ['score', 'playedAt'],
  },
  pagination: {
    initial: { page: 1, size: 20 },
    allowedSizes: [10, 20, 50] as const,
  },
});
```

`versionField`, `levelField` 같은 재료는 해당 화면 폴더에 두지 않고 실제 공유 범위에 따라 entity 또는 feature의 public API로 둔다. field는 `draftSchema`, `appliedSchema`, `toDraft`, `toApplied`, query binding을 함께 정의한다.

- `draftSchema`: 사용자가 입력 중인 draft를 검증하고 UI 오류를 제공한다.
- `appliedSchema`: URL에서 `QueryBinding.read`로 조립한 logical/domain 후보 값을 inbound 경계에서 검증한다.
- `toDraft`: 검증된 logical/domain 값을 UI draft로 변환한다.
- `toApplied`: `draftSchema`를 통과한 UI draft를 URL 상태가 사용할 logical/domain 값으로 변환한다.
- `QueryBinding.read/write`: 하나 이상의 물리 URL query key와 logical/domain 값 사이를 변환한다.

`toApplied`의 결과는 field 구현의 계약으로 신뢰하며 `appliedSchema`를 다시 적용하지 않는다. 따라서 `toApplied`가 허용된 domain 값만 만들도록 field 단위 테스트로 보장한다.

URL에 정수 `3` 대신 문자열 `three`를 기록해야 한다면 `QueryBinding.write`와 parser serializer가 처리하고, 반대로 URL을 읽을 때는 parser와 `QueryBinding.read`가 domain 값으로 조립한다. 백엔드 요청이 URL과 다른 parameter 이름이나 wire 형식을 요구하면 해당 route slice의 API query adapter에서 변환한다. `toApplied`에 백엔드 계약을 넣지 않는다.

## domain과 schema를 함께 쓰는 법

Zod schema는 domain을 대신하지 않는다. schema는 경계에서 값을 검증하고, domain 함수는 검증된 값을 해석하고 표현한다.

```text
URL inbound
  → Nuqs parser (물리 query 값 파싱)
  → QueryBinding.read (logical/domain 후보 조립)
  → appliedSchema (외부 URL 값 검증)
  → toDraft
  → UI draft

UI outbound
  → draftSchema (사용자 입력 검증)
  → toApplied (logical/domain 값 변환, 결과를 신뢰)
  → QueryBinding.write + parser serializer
  → URL

API request
  → table.params
  → route slice의 API query adapter
  → backend wire parameters
```

예를 들어 `medal.from(3)`은 허용된 메달 값만 반환하고, `medal.color(medalValue)`는 렌더링 규칙을 제공한다. 화면마다 `3 === gold` 같은 매핑 테이블을 만들지 않는다. API response DTO 검증과 DTO → domain 변환은 table field의 `appliedSchema`가 아니라 route slice의 `api/`가 담당한다.

## 공통 코드 승격 기준

새 코드는 가장 구체적인 소비처에서 시작한다.

1. 한 route에서만 쓰이면 route slice에 둔다.
2. 두 route에서 같은 사용자 동작을 공유하면 feature로 승격한다.
3. 여러 route가 같은 완성형 화면 영역을 공유하면 widget으로 조합한다.
4. 여러 기능이 같은 서비스 개념과 규칙을 공유하면 entity로 승격한다.
5. popn.gg의 도메인을 몰라도 재사용 가능한 인프라만 shared로 승격한다.

예외를 허용하되 다음 두 조건은 지킨다.

- 승격 때문에 의존성 방향이 뒤집히거나 순환하지 않을 것
- 낮은 레이어가 특정 route의 URL, 문구, 레이아웃을 알지 않을 것

`shared/lib/date.ts`, `shared/lib/seo.ts`처럼 작아 보이는 helper도 실제로 여러 slice에서 쓰이는지 확인한 후 합친다. 파일 크기보다 의미와 재사용 범위를 기준으로 한다.

## UI 배치

`components`라는 포괄적인 폴더명은 사용하지 않는다. 책임이 보이는 FSD 명칭을 사용한다.

- `ui/`: 렌더링 컴포넌트와 UI 조립
- `model/`: 상태, 타입, 변환 결과
- `api/`: 서버 계약과 query/mutation
- `lib/`: 해당 slice의 순수 helper
- `widgets/`: 여러 route가 공유하는 완성형 화면 영역의 조합

브랜드 디자인 시스템은 단일 앱 안의 `shared/ui`로 이동한다. 다만 `shared/ui`는 라우팅·i18n·도메인 데이터를 소유하지 않는다. 링크 대상과 번역은 호출부가 정한다.

앱 헤더·푸터처럼 모든 인증 화면에 공통인 셸은 `routes/app/ui`에 둔다. 특정 URL에서만 쓰는 화면 UI는 해당 route slice의 `ui`에 둔다.

## 오류 처리

- route loader/action/렌더링이 화면을 계속 그릴 수 없으면 해당 route의 `ErrorBoundary`
- React Query의 일시적인 목록 조회 실패는 table 또는 route의 query 상태 UI
- 사용자가 입력한 값의 오류는 field의 `draftSchema`
- 외부 URL에서 읽은 logical/domain 후보가 맞지 않으면 `appliedSchema`에서 버리고, 잘못된 URL 자체는 자동 수정하지 않음
- `toApplied` 결과는 재검증하지 않으므로 잘못된 변환은 field 단위 테스트에서 차단

오류 경계를 너무 낮게 쪼개지 않는다. 사용자에게 독립적으로 복구할 수 있는 단위가 생길 때 별도 경계를 만든다.

## 의존성 경계 검증

폴더 이름만으로는 `route slice → widget → feature → entity → shared` 규칙을 강제할 수 없다. 문서는 배치 판단의 기준으로 사용하고, 구조가 형성된 뒤에는 다음 실패를 정적 검사와 빌드에서 차단한다.

- `.server` module이 클라이언트 import graph에 포함되는 경우
- `shared → entity/feature/widget/route`, `entity → feature/widget/route`, `feature → widget/route`, `widget → route`처럼 의존 방향이 역전되는 경우
- 서로 다른 route slice가 상대 slice의 내부 파일을 직접 import하는 경우
- 같은 레이어의 slice끼리 직접 의존하거나 순환 의존성이 생기는 경우
- 허용된 server module 밖에서 `cloudflare:workers`를 직접 import하는 경우

초기에는 React Router production build로 server/client 경계를 검증하고 typecheck를 통과시키는 것을 최소 기준으로 삼는다. 실제 route·feature·entity 구조가 생기면 ESLint의 제한 import 규칙이나 boundary 검사 도구를 추가하고, slice 수가 늘어 순환을 눈으로 추적하기 어려워지면 dependency graph 검사도 추가한다. 도구 이름보다 위 규칙과 CI 실패 조건을 계약으로 유지한다.

## route slice 검토 기준

- route 모듈은 `loader/action/meta/ErrorBoundary`와 화면 연결만 담당한다.
- DTO가 UI import graph에 남아 있지 않다.
- URL 상태가 route, table, query 사이에서 한 곳만 source of truth로 정해져 있다.
- Cloudflare binding과 secret이 server module 밖으로 새지 않는다.
- 테스트가 loader/mapper/table state의 경계를 검증한다.
- 다른 slice로부터 우연히 import하지 않는다.

## 새 코드를 추가할 때의 짧은 체크리스트

1. 이 코드는 특정 URL의 화면인가, 여러 화면의 사용자 동작인가, 여러 route가 공유하는 완성형 화면 영역인가, 도메인 개념인가?
2. 가장 구체적인 route slice에서 시작할 수 있는가?
3. 서버 DTO와 화면 domain 타입을 분리했는가?
4. URL 상태의 소유자가 하나로 정해졌는가?
5. 두 번째 소비처가 실제로 생겼을 때만 아래 레이어로 승격했는가?
6. route/widget/feature/entity/shared 사이에 순환이나 책임 역전이 없는가?
7. Cloudflare binding과 secret 접근이 server module 안에 있고, 반환 값은 클라이언트에 안전한가?
8. 현재 단계에서 요구하는 build/typecheck/의존성 경계 검사를 통과하는가?

판단이 애매하면 일단 route slice에 두고, 사용처가 늘어난 시점에 이동한다. 이 원칙이 새 구조를 쉽게 찾고 변경하기 위한 가장 중요한 운영 규칙이다.
