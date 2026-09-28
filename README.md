# MyNaksh: AI Conversation Experience

A React Native chat screen where AI replies can carry interactive recommendation cards (gemstones, tarot readings, consultations, articles, offers, panchang and remedies). New card types can be added without changing the chat code.

**Stack:** React Native 0.86 (CLI) · TypeScript (strict) · React Navigation (native stack) · Zustand · HeroUI Native + Uniwind (Tailwind v4) · FlashList v2 · Reanimated 4 · react-native-keyboard-controller · bun

---

## Product demo

[![Watch product demo](https://img.shields.io/badge/%E2%96%B6_Watch-Product_Demo-blue?style=for-the-badge)](https://github.com/SehajBindra/ai-astrology-chat-mynakash/blob/main/product-demo.mp4)

[▶ Watch `product-demo.mp4`](https://github.com/SehajBindra/ai-astrology-chat-mynakash/blob/main/product-demo.mp4) (also in this repo as `./product-demo.mp4` — click to play).

---

## Running the app

Prerequisites: Node ≥ 22.11, [bun](https://bun.sh), Xcode (iOS) with CocoaPods, and/or Android Studio with an emulator.

```sh
bun install

# iOS (assumes ios/ exists locally, see note below)
cd ios && pod install && cd ..
bun run ios

# Android (assumes android/ exists locally, see note below)
bun run android
```

Metro starts automatically. To start it yourself, run `bun start`.

| Script | What it does |
| --- | --- |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | ESLint (`@react-native` config) |
| `bun run uniwind:types` | Regenerates `src/uniwind-types.d.ts` (Metro also does this on start) |

### Why ios/ and android/ are not committed

`/ios` and `/android` are intentionally gitignored: they are React Native CLI template output, not hand-written source, and they pull in large machine-specific artifacts (`Pods/`, `build/`, `.gradle/`). The reviewable surface for this assignment is the JS/TS source plus the product demo video above. A fresh clone therefore cannot run `bun run ios` / `bun run android` until the native projects are regenerated locally with the pinned `@react-native-community/cli` (20.1.0) followed by `install-expo-modules` (SDK 57). There is intentionally no `Gemfile` in the repo — iOS dependencies are installed with a plain `pod install` via CocoaPods, not Bundler.

### Why a CLI project contains Expo modules

HeroUI Native depends on `expo-blur`, and Uniwind's Metro integration depends on `expo/metro-config`. The project was created with the React Native Community CLI, and then `install-expo-modules` (SDK 57, which matches RN 0.86.3) added Expo modules support. It is still a bare CLI app: you run it with `react-native run-ios` / `run-android`, not Expo Go. The only Expo packages in use are `expo-blur`, `expo-clipboard` and `expo-haptics`.

### Demoing every state

The **Demo** button in the header opens a sheet that reloads the mock API in a chosen state:

- **Normal conversation**: the assignment's payload plus an earlier session from yesterday (shows date separators and more card types)
- **Empty conversation**: the "Start your conversation." state, with starter questions
- **Network failure**: the "Unable to load conversation." state with Retry
- **Fail every send**: forces the Sending → Failed → Retry flow. Without it, about 20% of sends fail at random.

The mock AI reply depends on keywords in your message. Try messages about *love*, *money / career* or *health* to get different card sets.

---

## Project structure

```
App.tsx                       re-exports src/app/app
global.css                    Tailwind + Uniwind + HeroUI styles entry
src/
  app/                        providers (gesture, safe area, keyboard, HeroUI) and navigation
  api/
    conversation-api.ts       ConversationApi interface + mock implementation (latency, failures, scenarios)
    seed.ts                   initial conversation (assignment payload, extended)
    assistant-replies.ts      keyword-based canned AI replies for the mock
  types/                      message, recommendation and feedback types (discriminated unions)
  store/
    conversation-store.ts     Zustand store (state + actions), built with a factory
    selectors.ts              per-message selectors
  recommendations/            recommendation framework (see below)
    types.ts                  RecommendationDefinition / RecommendationRegistry types
    registry.ts               type → definition map, resolveRecommendation()
    handle-recommendation-press.ts
    recommendation-rail.tsx   horizontal snapping card rail
    base-recommendation-card.tsx
    cards/                    one file per experience (card + definition), fallback-card
  features/
    conversation/
      screens/                ConversationScreen (state switch, action sheet host)
      timeline/               build-timeline (pure), timeline (FlashList), date-separator, typing-indicator
      messages/               message-row and one row per message type, bubble, avatar, reply quote, status
      actions/                get-message-actions (pure) and message-action-sheet
      feedback/               feedback-bar (like / dislike + reason chips)
      composer/               composer, reply-preview
      states/                 loading / empty / error
    demo/                     Demo scenarios menu (development aid, not product UI)
  components/icons/           small SVG icon set
  utils/                      dates, ids, async helpers
```

Code is grouped by feature. Anything reused across features (types, store, recommendation framework) lives at the top level of `src/`.

---

## Component architecture

```
conversation-screen
├─ message-interactions-context        (openActions(message))
├─ conversation-body                  loading | error | empty | timeline
│   └─ timeline (FlashList)
│       ├─ date-separator
│       └─ message-row(messageId, position)      ← subscribes to one message
│           ├─ user-message-row    → message-bubble, reply-quote, delivery-status (Retry)
│           ├─ ai-message-row      → message-bubble, recommendation-rail, feedback-bar
│           ├─ human-message-row   → message-bubble, "Astrologer" chip
│           └─ system-event-row
├─ composer → reply-preview
└─ message-action-sheet (one per screen)
```

- **`buildTimeline()` is a pure function.** It turns chronological messages into list rows. It inserts date separators and gives each message a group position (`single | first | middle | last`). A new group starts when the sender changes (for human astrologers, when the author changes), after a 5-minute gap, or on a new day. System events never group. Rows use the position to hide repeated names and avatars, tighten spacing and flatten bubble corners. Keeping this logic out of the components keeps rendering simple and predictable.
- **`message-row` picks the row component with an exhaustive `switch`.** Adding a new message type without a matching row fails type-checking.
- **One action sheet per screen.** Rows don't each mount a bottom sheet. They call `openActions(message)` from context, and the screen shows a single HeroUI `BottomSheet`. Which actions a message gets comes from `getMessageActions()`, a pure function: AI messages get Reply / Copy / Delete, failed user messages get Retry first, the astrologer's messages can't be deleted, and system events have no actions.
- **Shared building blocks.** HeroUI Native (`Card`, `Button`, `Chip`, `Avatar`, `BottomSheet`, `Input`, `Spinner`, `Switch`, toast) handles theming, press feedback and accessibility. App-level pieces (`message-bubble` with `tailwind-variants`, `base-recommendation-card`, `state-view`) keep the rest consistent.

---

## State management (Zustand)

A single conversation store, `src/store/conversation-store.ts`:

```ts
status: 'idle' | 'loading' | 'ready' | 'error'
messagesById: Record<string, Message>   // normalized
messageIds: string[]                    // chronological order
feedbackById: Record<string, { rating, reasons[] }>
replyToId: string | null
isAssistantTyping: boolean
```

- **Normalized messages.** Rows select `messagesById[id]` through per-message selectors, so React re-renders stay scoped to the affected row (rows are `memo` components). Strictly speaking, the memoized timeline array itself is rebuilt on any `messagesById` change — but that rebuild does not re-render unaffected rows.
- **The store is built by `createConversationStore({ api })`.** It depends only on the `ConversationApi` interface, so a mock or fake API can be passed in. Swapping the mock for a real HTTP or socket client doesn't touch any component.
- **Optimistic send.** The message is added immediately with a client id and `status: 'sending'`. It becomes `sent` or `failed` when the API responds. The client id stays the list key, so the row isn't re-mounted on acknowledgement. `retryMessage()` resends a failed message under the same id. If a message is deleted while its request is in flight, the late response is ignored.
- **Delete** removes the message and its feedback, and clears a pending reply to it. Quotes of a deleted message show "Original message was deleted".
- **Feedback** lives next to messages, keyed by id. Tapping the active rating again clears it, and switching to 👍 clears the dislike reasons.
- UI-only state (composer text, which message the action sheet shows) stays in components.

---

## Recommendation rendering strategy

This is the part the assignment weighs most, so the chat code never branches on recommendation type.

1. **Types.** Each experience is an interface with a literal `type` (for example `GemstoneRecommendation`, `type: 'gemstone'`). Together they form the `KnownRecommendation` union. The API may also send types this app version doesn't know yet (`UnknownRecommendation`, `type: string`).
2. **Registry.** `recommendationRegistry` maps every type to a definition:
   ```ts
   interface RecommendationDefinition<K> {
     type: K; label: string; ctaLabel: string;
     Card: ComponentType<{ item: RecommendationOfType<K>; onPress(): void }>;
     onPress?(item): void;   // optional override: analytics, deep link, ...
   }
   type RecommendationRegistry = { [K in RecommendationType]: RecommendationDefinition<K> };
   ```
   Because of the mapped type, adding a type to the union without registering it fails type-checking. Each card receives its exact item type, with no casts inside cards.
3. **Resolution.** `resolveRecommendation(item)` returns the matching definition, or a generic `FallbackCard` for unknown types, so a newer backend can't crash an older app. This is the only place where the per-type generics are widened.
4. **Rendering.** `recommendation-rail` maps items to `resolveRecommendation(item).Card` inside a horizontal, snapping `ScrollView`. Every card uses `base-recommendation-card` (HeroUI `Card` + `PressableFeedback`), so size, press feedback and accessibility labels stay consistent. A card only adds its own details, such as the planet, "3-card spread", "₹25/min" or a discount badge.
5. **Press handling.** All taps go through `handle-recommendation-press(item)`. It shows an Alert for now, and it's the one place to add analytics or navigation for every card type.

**Adding a new experience** (for example `kundli_match`):

1. Add `KundliMatchRecommendation` to `KnownRecommendation` in `src/types/recommendation.ts`.
2. Create `src/recommendations/cards/kundli-match.tsx` exporting a card component and its definition.
3. Add one line to `recommendationRegistry`. The compiler reports an error until you do.

The message and timeline code doesn't change. `panchang` and `remedy` were added this way, beyond the types in the assignment.

---

## Performance considerations

- **FlashList v2** virtualizes the timeline. `getItemType` gives date separators and each message type their own recycling pool, so a row with a card rail is never recycled into a one-line system event.
- **Chat scrolling uses FlashList's `maintainVisibleContentPosition`**: start rendering from the bottom, follow new messages while the user is near the bottom, and keep the visible message in place when rows are inserted or deleted. That covers "delete keeps the conversation position". A message the user just sent always scrolls into view.
- **Small, targeted re-renders.** Rows are `memo` components that take only `(messageId, position)` and subscribe to their own message and feedback through selectors. `buildTimeline` is memoized on `messageIds` and `messagesById`.
- **The card rail is a plain `ScrollView`**, not a nested virtualized list. A message has a handful of cards, and nesting virtualized lists costs more than it saves at that size.
- **Styling compiles at build time.** Uniwind turns Tailwind classes into styles at build time, and conditional classes are written out in full so they're included.
- **Animations run on the UI thread** with Reanimated: typing dots, feedback chip expand/collapse and layout transitions.

---

## Trade-offs and limitations

- **CLI + Expo modules** instead of a plain Expo app. This follows the assignment's "CLI preferred", but HeroUI Native and Uniwind are documented mainly for Expo, so setup took more native configuration (see above).
- **Mock API state is a mutable module object** (`mockApiConfig`) so the Demo menu can flip scenarios. A real app would inject configuration instead.
- **No persistence.** The conversation reloads from the mock on launch, and feedback, deletes and sent messages aren't saved. A persistence layer (Zustand `persist` or a query cache) would go in the store or API layer.
- **Server ids aren't adopted.** Optimistic messages keep their client id so list keys stay stable. A real backend would store the server id alongside it.
- **No streaming AI responses.** Assistant replies arrive as complete messages; there is no token-by-token streaming yet.
- **Mock transport only.** `ConversationApi` is a mocked implementation. A real REST + WebSocket transport with retry and backoff would sit behind the same interface.
