Design a complete multi-platform digital health application called Sentina 
— Perinatal Mental Health Solution. Create all three interfaces in one 
Figma file: (1) Patient Mobile App, (2) Clinician Dashboard, and 
(3) MCH Nurse Portal. All interfaces must share the same design system, 
brand identity, and data.

═══════════════════════════════════════════════════════════
DESIGN SYSTEM — APPLY TO ALL INTERFACES
═══════════════════════════════════════════════════════════

BRAND
App name: Sentina™
Tagline: Perinatal Mental Health Solution
Logo: Teal S-curve figure embracing an amber infant figure, 
with "Sentina™" wordmark in deep teal to the right. 
Use on all headers and splash screens.

COLOUR PALETTE
Primary teal: #1F7A8C (buttons, headers, active states, 
  borders, icons)
Deep teal: #1A5C6B (sidebar backgrounds, dark headers, 
  section titles)
Light teal: #E8F4F6 (card backgrounds, info banners, 
  passive monitoring indicators)
Warm amber: #F5A623 (infant elements, amber risk, 
  accent highlights)
Risk red: #D64045 (high risk badges, critical alerts, 
  EPDS ≥ 13 indicators)
Risk amber: #F5A623 (medium risk badges, monitor alerts, 
  warning states)
Risk green: #2ECC71 (low risk badges, stable states, 
  positive confirmations)
White: #FFFFFF (card surfaces, main backgrounds)
Light grey: #F8FAFB (alternating table rows)
Body text: #1A2B32 (all primary text)
Secondary text: #6B7280 (labels, captions, placeholders)

TYPOGRAPHY
Font family: Inter or DM Sans
Sizes:
  Page title: 24px bold dark teal
  Section title: 18px bold dark teal
  Card title: 16px bold dark teal
  Body: 14px regular body text
  Label: 13px regular secondary text
  Caption: 12px regular secondary text
  Small: 11px italic secondary text

COMPONENTS — BUILD THESE AS REUSABLE COMPONENTS
Risk badge: Pill shape, 12px bold white text
  RED badge: #D64045 background, label "High Risk"
  AMBER badge: #F5A623 background, label "Monitor"
  GREEN badge: #2ECC71 background, label "Stable"
Teal button: #1F7A8C background, white bold 16px text,
  12px border radius, 48px height, full width or auto
Outline button: White background, #1F7A8C border 1.5px,
  #1F7A8C text, 12px border radius
Card: White background, 12px border radius,
  shadow 0 2px 8px rgba(31,122,140,0.08), 16px padding
Left-accent card: Card + 4px solid left border
  Red accent: #D64045
  Amber accent: #F5A623
  Teal accent: #1F7A8C
Info banner: #E8F4F6 background, 12px border radius,
  teal info icon left, 13px secondary text
Status dot: 8px circle
  Green dot: #2ECC71 (active/connected)
  Amber dot: #F5A623 (warning)
  Red dot: #D64045 (critical)
Toggle: Teal (#1F7A8C) when on, grey (#D1D5DB) when off,
  pill shape with white circle indicator
Text input: White background, #1F7A8C border on focus,
  8px border radius, 14px placeholder text grey
Radio button: Teal filled circle when selected,
  grey outline when unselected

SPACING
Card internal padding: 16px
Section spacing: 24px between sections
Component gap: 12px between related elements
Page margin: 24px horizontal on mobile,
  32px horizontal on desktop

SHADOWS
Card shadow: 0 2px 8px rgba(31,122,140,0.08)
Sidebar shadow: 2px 0 8px rgba(0,0,0,0.08)

BORDER RADIUS
Cards: 12px
Buttons: 8px
Pills and badges: 24px (full round)
Input fields: 8px
Mini cards: 10px

ICONS
Use Heroicons or Phosphor Icons throughout.
Key icons needed:
  Heart/health: patient and mood
  Bell: notifications and alerts
  Shield/lock: privacy and security
  Baby/infant: infant records and flags
  Chart/trend: timeline and analytics
  User/avatar: profile and clinicians
  Wearable/watch: device connection
  Flag: infant surveillance flag
  Check/tick: confirmation and completion
  Warning/exclamation: alerts and risks
  Phone: crisis contacts
  Arrow up/down/right: trends and navigation

═══════════════════════════════════════════════════════════
INTERFACE 1 — PATIENT MOBILE APP
Platform: iOS mobile, 390x844px per screen
═══════════════════════════════════════════════════════════

BOTTOM NAVIGATION BAR (appears on all patient screens 
except onboarding and crisis)
White background, 60px height, top border #E5E7EB 0.5px
4 icons evenly spaced:
  Home (house icon) — active state: teal filled icon 
    + teal label "Home" 11px
  Timeline (chart icon) — inactive: grey icon + grey label
  Family (people icon) — inactive
  Profile (person icon) — inactive
Active icon uses #1F7A8C fill, inactive uses #9CA3AF

TOP HEADER (all patient screens)
#1F7A8C background, 60px height
Sentina logo (white version) left 16px
Screen title white bold 18px centred
Back arrow white left (on sub-screens)

── FLOW 1A: ONBOARDING AND CONSENT (5 screens) ──

SCREEN 1 — Welcome
Full screen white background
Sentina logo (colour version, 200px wide) centred
  at 35% from top
"Sentina™" below logo in deep teal bold 32px
"Perinatal Mental Health Solution" grey 16px italic
Below centre:
  Teal full-width button "Get started" (48px height)
  Grey text link "I already have an account" 14px centred
Bottom: "Your privacy is protected by design" 
  padlock icon grey 12px

SCREEN 2 — Account Creation
Header: "Create your account" teal background
White background body
Form card (white, 12px radius, shadow):
  Label "Full name" dark teal 13px bold
  Text input field
  Label "Email address"
  Text input field (email keyboard)
  Label "Password"
  Text input field (secure)
  Label "Date of birth"
  Date picker field
  Label "Are you currently:"
  Two radio options side by side:
    "Pregnant" | "Postpartum"
  If pregnant: "Gestational week" number input appears
  If postpartum: "Weeks since birth" number input appears
Teal full-width button "Continue" at bottom

SCREEN 3 — Four-Stream Consent
Header: "Before we begin" teal background white text
White body
Subtitle: "Sentina monitors four types of data. 
  You control each one." grey 14px, 16px top margin
Four consent toggle cards stacked (white card, 
  teal left border, 12px between):
  Card 1:
    Left: mood emoji icon teal circle 40px
    Title: "Daily mood check-ins" dark teal bold 15px
    Description: "You log your mood and optional journal
      notes each day." grey 13px
    Right: toggle (ON by default, teal)
  Card 2:
    Left: clipboard icon teal circle 40px
    Title: "Weekly EPDS screening"
    Description: "A 10-question clinical questionnaire
      completed once per week." grey 13px
    Right: toggle (ON by default)
  Card 3:
    Left: watch icon teal circle 40px
    Title: "Passive wearable monitoring"
    Description: "Sentina reads HRV, sleep, heart rate,
      and steps from your wearable device. Only 4 signals
      are collected." grey 13px
    Right: toggle (ON by default)
  Card 4:
    Left: baby icon amber circle 40px
    Title: "Infant record linkage"
    Description: "Link your infant's My Health Record for
      integrated developmental surveillance." grey 13px
    Right: toggle (OFF by default, grey)
Comprehension check box (light teal background):
  "In your own words, what will Sentina monitor?"
  Multiline text input teal border
  Caption: "This helps us confirm you understand 
    your consent." grey 11px italic
Teal full-width button "I understand and agree"

SCREEN 4 — Wearable Connection
Header: "Connect your wearable" teal background
White body
Subtitle: "Sentina will monitor HRV, sleep, heart rate,
  and steps — nothing else." grey 14px
Three wearable option cards stacked (white card, shadow):
  Card 1:
    Apple Watch icon (grey apple logo) left 40px
    "Apple Watch" dark teal bold 15px
    "via Apple HealthKit" grey 13px
    Teal "Connect" button right (outline style)
  Card 2:
    Fitbit logo left 40px
    "Fitbit" dark teal bold 15px
    "via OAuth 2.0" grey 13px
    Teal "Connect" button right (outline style)
  Card 3:
    Garmin logo left 40px
    "Garmin" dark teal bold 15px
    "via OAuth 2.0" grey 13px
    Teal "Connect" button right (outline style)
Info banner below cards (light teal):
  Padlock icon teal
  "Only 4 signals are collected. No GPS or audio." 
  grey 13px
Grey text link "Skip for now — connect later" 
  centred below banner

SCREEN 5 — Setup Complete
Full screen teal (#1F7A8C) background
Sentina logo white centred at 30% from top
White circle with green tick icon 80px below logo
"You are all set, Sarah" white bold 24px
"Sentina is now monitoring in the background." 
  white 16px opacity 0.85
"Apple Watch connected" white 14px opacity 0.7
  watch icon left
Teal white-bordered button "Go to home" 
  at 75% from top

── FLOW 1B: DAILY USE — ACTIVE STREAM (3 screens) ──

SCREEN 6 — Home Screen
Header: teal background
  Sentina logo white left
  Bell icon white right with red dot if alerts exist
Body white background:
  Greeting card (white, teal left border 4px):
    "Good morning, Sarah" dark teal bold 22px
    "Week 32 of pregnancy" grey 14px
  Daily check-in card (white, shadow, 12px radius):
    "How are you feeling today?" dark teal bold 16px
    5 emoji horizontal row (44px each):
      😢 😕 😐 🙂 😊
      Labels 1–5 below each in grey 12px
      Selected emoji has teal 52px circle highlight
    "Check in now" teal button below emoji row
  Passive monitoring status bar 
    (light teal #E8F4F6, 40px height, 24px radius):
    Green status dot left 8px
    "Sentina is monitoring in the background" 
      dark teal 13px
    Wearable name right grey 12px "Apple Watch"
  Quick stats row (3 mini cards, white, shadow):
    Card 1: HRV icon teal, "HRV" grey 11px, 
      "62ms" dark teal bold 16px, "7-day avg" grey 11px
    Card 2: Moon icon, "Sleep", "7.2 hrs" dark teal bold
    Card 3: Steps icon, "Steps", "6,840" dark teal bold
  Bottom navigation bar

SCREEN 7 — Daily Check-in
Header: "Today's check-in" teal
White body:
  Mood selection card (white, shadow):
    "How are you feeling today?" dark teal bold 16px
    5 emoji row — same as home screen
    Currently selected: emoji 3 (neutral) 
      with teal ring highlight
  Journal card (white, shadow):
    "Today's notes (optional)" dark teal bold 14px
    Multiline text input, teal border on focus
    Placeholder: "How are you feeling today?"
    Privacy indicator below input:
      Padlock icon teal 14px
      "Processed privately on your device" 
      grey 11px italic
  Passive monitoring card (light teal background):
    "Sentina is also monitoring your:" dark teal 13px
    Three pill tags: "HRV" | "Sleep" | "Steps"
      light teal background, teal text 12px
  Teal full-width button "Done for today"
  
  After submission — confirmation state:
    Green tick icon 40px centred
    "Thank you. Sentina is keeping watch." 
      dark teal bold 16px
    "Check back tomorrow" grey 14px

SCREEN 8 — Weekly EPDS Questionnaire
Header: "Weekly check-in" teal
  "10 questions — about 3 minutes" white 13px
Progress bar: teal fill below header, 
  shows question X of 10
White body (one question per screen):
  Question number: "Question 3 of 10" grey 13px
  Question text: "I have blamed myself unnecessarily 
    when things went wrong." dark teal bold 17px
  4 radio options stacked (white cards, 
    teal selected state):
    "Yes, most of the time"
    "Yes, some of the time"
    "Not very often"
    "No, never"
  "Next" teal full-width button
  
  On question 10 (self-harm ideation):
    If any answer other than "Never" selected:
    → Immediately navigate to Crisis Screen (Screen 10)
    → Send FHIR Communication to clinician dashboard
  
  On completion (score < 13):
    Green confirmation screen:
      Tick icon green 40px
      "Your responses have been recorded." 
        dark teal bold 16px
      "Your midwife can see your results." 
        grey 14px
      "Return home" teal button
  
  On completion (score ≥ 13):
    Amber confirmation with alert:
      Warning icon amber 40px
      "Thank you for sharing. Your midwife has
        been notified and will be in touch." 
        dark teal bold 16px
      Crisis contacts shown below (same as Screen 10)
      "Return home" teal button

── FLOW 1C: PASSIVE STREAM AND TIMELINE (1 screen) ──

SCREEN 9 — Dual-Stream Mood Timeline
Header: "My Mood Timeline" teal
White body:
  Stream toggle (3 pill buttons horizontal):
    "Both streams" — active: teal fill white text
    "Active only" — inactive: white, teal outline
    "Passive only" — inactive: white, teal outline
  Main chart card (white, shadow, 16px padding):
    Title: "12-Week Overview" dark teal bold 14px
    Line chart:
      X-axis: weeks 1–12, grey labels 11px
      Y-axis left: 0–30 (EPDS scale), grey labels
      Series 1: solid teal line, EPDS scores weekly
      Series 2: dashed grey line, passive composite daily
      Red dashed horizontal line at y=13:
        Label "Clinical threshold" red 11px right
      Daily mood dots overlaid:
        Green dots: mood 4–5
        Amber dots: mood 3
        Red dots: mood 1–2
      Chart legend below:
        Teal line "EPDS Score"
        Grey dashed line "Passive Risk"
        Green/amber/red dots "Daily mood"
  Daily summary card (light teal, teal left border):
    Auto-generated text based on current risk:
    GREEN state: "Your mood indicators have been 
      stable this week, including your sleep and 
      heart rate patterns. Keep it up."
    AMBER state: "Sentina has noticed some changes 
      in your sleep and heart rate patterns over 
      the past few days. Your midwife has been 
      notified."
    RED state: "Sentina has noticed significant 
      changes. Your care team has been alerted 
      and will contact you."
    DISENGAGED (48+ hours no check-in):
      "We are keeping an eye on things in the 
      background. Whenever you are ready, 
      we are here."
  Wearable metric mini-cards row (3 cards):
    Card 1: HRV icon teal, "62ms" bold dark teal,
      "7-day average" grey 11px,
      trend arrow ↑ green or ↓ red
    Card 2: Moon icon, "Sleep", "7.2 hrs" bold,
      trend arrow
    Card 3: Steps icon, "Steps", "6,840" bold,
      trend arrow
  Bottom navigation bar

── FLOW 1D: CRISIS RESPONSE (1 screen) ──

SCREEN 10 — Crisis Resource Screen
Full screen — no bottom navigation shown
Header: deep teal #1A5C6B background, 80px height
  Sentina logo white left
  "We are here for you" white bold 22px centred
  Amber horizontal line 3px below header text
White body:
  Reassurance card (white, amber left border 4px):
    Amber heart icon 36px with teal outline
    "Sentina has noticed you may need some support 
      right now. Your care team has been notified." 
      dark teal 16px
    "You are not alone." teal bold 16px below
  "Reach out now" dark teal bold 16px section title
  Three crisis contact cards stacked (white, shadow):
    Card 1:
      Phone icon teal left 36px circle
      "Lifeline" dark teal bold 15px
      "13 11 14" teal bold 20px
      "24/7 crisis support" grey 12px
      "Call now" teal outline button right
    Card 2:
      Phone icon teal left 36px circle
      "Beyond Blue" dark teal bold 15px
      "1300 22 4636" teal bold 20px
      "24/7 mental health support" grey 12px
      "Call now" teal outline button right
    Card 3:
      Phone icon teal left 36px circle
      "PANDA" dark teal bold 15px
      "1300 726 306" teal bold 20px
      "Perinatal mental health" grey 12px
      "Call now" teal outline button right
  Clinician notification banner (light teal):
    Tick icon teal 16px
    "Your midwife has been notified and will 
      be in touch." dark teal 13px
  "Return to home screen" grey text link 
    14px centred bottom

── FLOW 1E: FAMILY HEALTH (1 screen) ──

SCREEN 11 — Family Screen
Header: "Family Health" teal, Sentina logo left
Bottom navigation (Family icon active teal)
White body:
  If infant linkage consent given:
    Infant card (white, shadow, amber left border):
      Baby icon amber circle 40px left
      Infant name dark teal bold 16px
      DOB grey 13px
      Gestational age "8 weeks old" grey 13px
      Right side: flag status badge
        No flag: GREEN badge "No concerns"
        Amber flag: AMBER badge "Flag active"
        Red flag: RED badge "Flag active"
    If flag active — expanded card section:
      "Your MCH nurse has been notified." teal 13px tick
      "Enhanced developmental surveillance 
        recommended at your next visit." grey 13px
      "Next MCH appointment: [date]" grey 13px
      "Your midwife can also see this." grey 11px italic
  If no consent given:
    Empty state card (light teal):
      Baby icon grey 48px centred
      "Connect your infant's My Health Record" 
        dark teal bold 16px
      "Sentina can flag your infant's MCH nurse 
        if you need extra support." grey 14px
      Teal outline button "Connect infant record"

── FLOW 1F: PROFILE AND SETTINGS (1 screen) ──

SCREEN 12 — Profile Screen
Header: "Profile" teal
Bottom navigation (Profile icon active teal)
White body:
  Profile header card (white, shadow):
    Avatar circle teal 60px with initials
    Name dark teal bold 18px
    "Week 32 of pregnancy" grey 14px
    Teal outline button "Edit profile" right
  Settings sections (white cards, each 
    with teal section header 13px bold):
    Section 1 "Wearable connections":
      Apple Watch row: 
        Watch icon | "Apple Watch" | 
        GREEN dot "Connected" | "Change" grey link
    Section 2 "Consent settings":
      Four toggle rows (same as Screen 3):
        Mood monitoring | EPDS | Wearable | Infant
        Each with current on/off state
    Section 3 "Notifications":
      Daily check-in reminder: toggle on
      Weekly EPDS reminder: toggle on
      Clinician messages: toggle on
    Section 4 "Privacy":
      "View privacy policy" teal link
      "How Sentina uses your data" teal link
      "Download my data" grey link
  "Sign out" red text link centred bottom 14px

═══════════════════════════════════════════════════════════
INTERFACE 2 — CLINICIAN DASHBOARD
Platform: Desktop web, 1440x900px per screen
═══════════════════════════════════════════════════════════

LEFT SIDEBAR (appears on all clinician screens)
Width: 240px
Background: deep teal #1A5C6B
Top: Sentina logo white version, 24px padding all sides
Navigation items (white 14px, 48px height each):
  Icon left 20px + label
  Patients — active state: white background 
    opacity 15%, teal left border 3px
  Alerts — with red badge if unread alerts exist
  Care Plans
  Reports
  Settings
Bottom section:
  Thin white line separator
  Avatar circle white 36px with initials
  Clinician name white 14px bold
  Role grey-white 12px "Midwife — Royal Women's Hospital"

TOP HEADER BAR (appears on all clinician screens)
White background, 64px height
Bottom border #E5E7EB 1px
Left: page title dark teal bold 24px
Right row: 
  Search bar (white, grey border, teal on focus, 
    240px wide, magnifier icon left)
  Filter dropdown (white, grey border, 
    "All patients" default)
  Bell notification icon 24px dark teal
    Red badge with count if unread

── FLOW 2A: EHR LAUNCH (1 screen) ──

SCREEN 1 — SMART on FHIR Launch State
Shown briefly during EHR-launched session start
Full screen white background
Sentina logo teal centred 40% from top
Loading spinner teal below logo
"Loading patient context from EHR..." grey 14px
"Authenticated via EHR Identity Provider" grey 12px
  tick icon green left
Auto-navigates to Screen 2 on completion

── FLOW 2B: PATIENT PRIORITY LIST (1 screen) ──

SCREEN 2 — Patient Priority List
Left sidebar + top header
Main content area white background:
  Summary cards row (4 cards, 200px wide each,
    white, shadow, teal top border 3px):
    Card 1: "Total Patients" grey 13px,
      "24" dark teal bold 32px
    Card 2: "High Risk" grey 13px,
      "3" red #D64045 bold 32px
    Card 3: "Needs Attention" grey 13px,
      "7" amber bold 32px
    Card 4: "Stable" grey 13px,
      "14" green bold 32px
  Alert banner (amber #FEF3C7 background, 
    amber left border 4px, 48px height):
    Warning icon amber left
    "2 patients require immediate attention — 
      EPDS score above clinical threshold" 
      dark text 14px
    "View all alerts" teal link right
  Patient list card (white, shadow, 
    full width, border radius 12px):
    Table header row (light teal #E8F4F6 background):
      Patient | Risk Level | EPDS Score | 
      Passive Trend | Last Check-in | 
      Infant Flag | Action
      Each header: dark teal bold 13px, 16px padding
    5 patient data rows (alternating white 
      and light grey #F8FAFB):
      Row 1 (highest risk — red):
        "Sarah Mitchell" dark teal bold 15px
        "34w postpartum" grey 12px below name
        RED badge "High Risk"
        "16" red bold 16px
        ↓ down arrow icon red "Declining"
        "3 days ago" red 13px
        Amber flag icon (Flag resource active)
        "View" teal outline button 32px height
      Row 2 (amber):
        "Jennifer Lee" + "28w pregnant"
        AMBER badge "Monitor"
        "11" amber bold
        → stable arrow grey
        "Yesterday" grey
        No flag icon
        "View" teal outline button
      Rows 3–5 (green — stable):
        GREEN badge "Stable"
        EPDS scores 6, 4, 7 in green
        ↑ up arrows green or → stable grey
        "Today" or "Yesterday" grey
        No flag icons
        "View" teal outline buttons
    Table footer: 
      "Showing 5 of 24 patients" grey 13px left
      Pagination controls right: < 1 2 3 >

── FLOW 2C: PATIENT DETAIL PANEL (1 screen) ──

SCREEN 3 — Patient Detail View
Left sidebar + top header
Main content area two-column layout:

LEFT COLUMN (60% width):
  Patient header card (white, shadow):
    Avatar circle teal 52px with initials "SM" left
    "Sarah Mitchell" dark teal bold 20px
    "34 weeks postpartum • DOB: 12 Mar 1990" grey 13px
    "Assigned midwife: You" grey 12px
    Right side:
      RED badge "High Risk" large
      Row of action buttons:
        "Send message" teal button
        "Create referral" teal outline button
        "View in My Health Record" grey link
  
  Dual-stream timeline chart card (white, shadow):
    Title: "16-Week Mood Overview" dark teal bold 16px
    Line chart (wider desktop format):
      X-axis: 16 weeks, grey labels
      Y-axis: 0–30 EPDS scale
      Solid teal line: EPDS weekly scores
      Dashed grey line: passive composite daily
      Red dashed threshold at y=13 
        labelled "Clinical threshold (13)"
      Coloured daily dots: green/amber/red
      Chart legend below chart
    Stream toggle above chart:
      "Both" (active teal) | "Active" | "Passive"
  
  EPDS history table card (white, shadow):
    Title: "EPDS History" dark teal bold 16px
    Table header (light teal): 
      Date | Score | Change | Administered By
    4 rows:
      "12 May 2025" | "8" green | "—" | "Self"
      "19 May 2025" | "10" grey | "↑2" amber | "Self"
      "26 May 2025" | "13" amber | "↑3" amber | "Self"
      "2 Jun 2025" | "16" red bold | "↑3" red | "Self"
        Last row highlighted with red background tint

RIGHT COLUMN (40% width):
  Active alerts card (white, red left border):
    Title: "Active Alerts" red bold 16px
    Alert item 1:
      Red dot left
      "EPDS score 16 — above clinical threshold" 
        dark text 14px
      "Today 9:42am" grey 12px
    Alert item 2:
      Amber dot left
      "No active check-in for 3 days — 
        passive monitoring active" dark text 14px
      "3 days ago" grey 12px
    Alert item 3 (if passive deterioration):
      Amber dot left
      "Passive physiological deterioration detected
        — HRV declining, sleep reduced" 14px
      "2 days ago" grey 12px
  
  Wearable trends card (white, teal top border):
    Title: "Passive Monitoring" teal bold 14px
    Three metric rows:
      HRV icon | "Heart Rate Variability" | 
        "58ms" red bold | ↓ red | sparkline chart
      Moon icon | "Sleep Duration" | 
        "5.8 hrs" amber bold | ↓ amber | sparkline
      Steps icon | "Daily Steps" | 
        "3,200" amber bold | ↓ amber | sparkline
  
  Infant surveillance card (white, amber left border):
    Shown only when Flag resource active
    Baby icon amber 24px left
    "Infant Flag Active" amber bold 14px
    "Maternal risk elevated for 3 weeks." grey 13px
    "Enhanced developmental surveillance 
      recommended." grey 13px
    "Flag sent to MCH nurse: 14 Apr 2025" 
      teal 12px tick icon left
  
  Care plan card (white, teal top border):
    Title: "Active Care Plan" dark teal bold 14px
    Two plan items with tick icons:
      Tick icon teal | "GP Mental Health 
        Treatment Plan — referred" 13px
      Tick icon teal | "Perinatal psychology 
        referral — pending" 13px
    "View full care plan" teal link 13px

── FLOW 2D: ALERTS FEED (1 screen) ──

SCREEN 4 — Alerts Feed
Left sidebar (Alerts nav item active) + top header
Main content:
  Filter tabs (teal underline on active):
    All | Unread (3) | High Priority | Infant Flags
  Alert cards list (stacked, white, shadow):
    Alert card 1 (RED — unread, left border red):
      Red dot 8px left | "HIGH PRIORITY" red 11px bold
      "Sarah Mitchell — EPDS score 16, 
        above clinical threshold" dark text 15px bold
      "Action required: Review patient and 
        initiate care plan" grey 13px
      "Today 9:42am" grey 12px
      "View patient" teal link right
      "Acknowledge" grey outline button right
    Alert card 2 (AMBER — unread, amber left border):
      Amber dot | "MONITOR" amber 11px bold
      "Sarah Mitchell — No active check-in 
        for 3 days. Passive monitoring active." 15px
      "3 days ago" grey 12px
      "View patient" teal link | "Acknowledge" grey button
    Alert card 3 (AMBER — read, grey left border):
      Grey dot | "INFANT FLAG" amber 11px bold
      "Baby Mitchell — Maternal risk elevated 
        3 weeks. Flag written to infant My Health Record.
        MCH nurse notified." 14px grey
      "14 Apr 2025" grey 12px
      "View patient" teal link

═══════════════════════════════════════════════════════════
INTERFACE 3 — MCH NURSE PORTAL
Platform: Desktop web, 1440x900px per screen
═══════════════════════════════════════════════════════════

LEFT SIDEBAR (appears on all MCH nurse screens)
Width: 240px
Background: deep teal #1A5C6B (same as clinician)
Top: Sentina logo white, 24px padding
Navigation items white 14px 48px height:
  Infant Flags (active with teal left border)
  Assessments
  Care Plans
  Settings
Bottom:
  Separator white line
  Avatar circle white 36px initials
  "Lisa Chen" white bold 14px
  "MCH Nurse — City of Melbourne" grey-white 12px

TOP HEADER BAR
Same structure as clinician dashboard
Left: page title dark teal bold 24px
Right: Search | Filter | Bell notification icon

── FLOW 3A: PORTAL ACCESS (1 screen) ──

SCREEN 1 — Portal Launch State
Same SMART on FHIR loading screen as clinician
"Loading infant surveillance data..." grey 14px
"Role: MCH Nurse — accessing infant flags only" 
  teal 12px with shield icon
Auto-navigates to Infant Flag List

── FLOW 3B: INFANT FLAG LIST (1 screen) ──

SCREEN 2 — Infant Surveillance Dashboard
Left sidebar + top header
Page title: "Infant Surveillance Dashboard"
Subtitle: "Infants with active maternal mental 
  health flags" grey 14px
Main content:
  Summary cards row (3 cards, white, shadow, 
    teal top border):
    "Active Flags" | "5" dark teal bold 32px
    "Red Risk" | "2" red bold 32px
    "Amber Risk" | "3" amber bold 32px
  Infant flag list card (white, shadow, full width):
    Table header (light teal):
      Infant Name | DOB | Maternal Risk | 
      Risk Duration | Recommendation | 
      Assessment Due | Action
    4 infant rows:
      Row 1 (RED):
        Baby icon amber | "Baby Mitchell" bold 15px
        "12 Mar 2025" grey 13px
        RED badge "High Risk"
        "3 weeks" red 13px
        "Enhanced developmental surveillance" 
          dark text 13px
        "Overdue" red bold 13px
        "Assess now" teal button
      Row 2 (AMBER):
        "Baby Thompson"
        AMBER badge "Elevated Risk"
        "2 weeks" amber
        "Monitor development closely"
        "Due today" amber bold
        "Assess now" teal button
      Row 3 (AMBER):
        "Baby Nguyen"
        AMBER badge
        "2 weeks"
        "Monitor development closely"
        "Due this week" grey
        "Assess now" teal button
      Row 4 (AMBER):
        "Baby Patel"
        AMBER badge
        "2 weeks"
        "Monitor development closely"
        "Due next week" grey
        "Schedule" grey outline button
  Information panel (light teal, 
    below table, full width):
    Info icon teal left
    "Flags are generated by Sentina when maternal 
      mental health risk is amber or red for 2 or 
      more consecutive weeks. Assessment results 
      submitted here are shared with the maternal 
      care team via the Sentina FHIR server." 
      grey 13px

── FLOW 3C: DEVELOPMENTAL ASSESSMENT ENTRY (1 screen) ──

SCREEN 3 — Assessment Entry Form
Left sidebar (Assessments active) + top header
Page title: "Record Developmental Assessment"
Breadcrumb: "Infant Flags > Baby Mitchell > 
  New Assessment" grey 13px
Two column layout:

LEFT COLUMN (65% width):
  Patient context card (white, amber left border 4px):
    Left section:
      Baby icon amber circle 48px
      "Baby Mitchell" dark teal bold 18px
      "DOB: 12 Mar 2025 (12 weeks old)" grey 13px
      "Mother: Sarah Mitchell" grey 13px
    Right section:
      "Maternal Risk:" grey 13px
      RED badge "High Risk" large
      "Risk duration: 3 weeks" amber 13px
      "Sentina flag active since: 14 Apr 2025" 
        grey 12px
  
  Assessment form card (white, shadow, teal top border):
    Header: "ASQ-3 Developmental Assessment" 
      teal bold 16px
    Form row 1 two columns:
      Left: "Assessment Date" label dark teal 13px bold
        Date picker input
      Right: "Assessment Location" label
        Dropdown: Home visit / Clinic / Other
    "Assessor" label: pre-filled text field
      "Lisa Chen — MCH Nurse" grey (non-editable)
    
    "Domain Scores" section title dark teal bold 16px
    Five domain rows (each with bottom border grey):
      Domain 1 row:
        "Communication" dark teal 14px bold left
        Three radio buttons centred:
          ◉ "Above cutoff" teal selected
          ○ "Near cutoff" 
          ○ "Below cutoff"
        "Notes" text input right 200px
      Domain 2: "Gross Motor" — same structure
      Domain 3: "Fine Motor" — same structure
      Domain 4: "Problem Solving" — same structure
      Domain 5: "Personal-Social" — same structure
    
    "Overall ASQ-3 Result" label dark teal 14px bold
    Dropdown (full width, teal border):
      Options: 
        Development on track (green dot)
        Monitor development (amber dot) — selected
        Referral recommended (red dot)
    
    "Clinical Observations" label dark teal 14px bold
    Multiline textarea teal border 120px height
    Placeholder: "Document your clinical observations 
      and any concerns..."
    
    "Submit Assessment" teal full-width button 48px
    
    After submission — success state:
      Green tick icon 48px centred in card
      "Assessment recorded successfully" 
        dark teal bold 16px
      "Results shared with Sarah Mitchell's 
        care team via Sentina." grey 14px
      "Return to infant flags" teal link

RIGHT COLUMN (35% width):
  Maternal mental health context card 
    (white, shadow, teal top border):
    Header: "Maternal Mental Health Context" 
      teal bold 14px
    Sub-header: "For clinical context only — 
      provided by Sentina" grey 11px italic
    Risk level row:
      "Current risk:" grey 13px
      RED badge "High Risk" right
    EPDS trend section:
      "EPDS Score (last 8 weeks)" grey 13px bold
      Small sparkline chart teal line 
        showing upward trend
      "Latest score: 16" red bold 14px
      "Clinical threshold: 13" grey dashed 
        line on chart
    Passive monitoring summary:
      "Passive signals (last 7 days)" grey 13px bold
      Three rows:
        HRV icon | "HRV" | "58ms ↓" red 13px
        Moon icon | "Sleep" | "5.8 hrs ↓" amber 13px
        Steps icon | "Steps" | "3,200 ↓" amber 13px
    Flag section:
      "Flag duration:" grey 13px
      "3 weeks" red bold 14px
    Link below:
      "Full maternal record available via 
        My Health Record" teal link 12px

── FLOW 3D: ASSESSMENT HISTORY (1 screen) ──

SCREEN 4 — Assessment History
Left sidebar (Assessments active) + top header
Page title: "Assessment History"
Filter tabs (teal underline active):
  All assessments | This month | Referral recommended
Assessment history table (white card, shadow):
  Table header (light teal):
    Infant Name | Assessment Date | ASQ-3 Result | 
    Assessor | Shared with Care Team | Action
  3 completed assessment rows:
    Row 1:
      Baby icon | "Baby Nguyen" dark text bold
      "15 Apr 2025" grey
      GREEN "Development on track"
      "Lisa Chen" grey
      Tick icon green "Shared" green 12px
      "View" teal link
    Row 2:
      "Baby Thompson"
      "10 Apr 2025"
      AMBER "Monitor development"
      "Lisa Chen"
      Tick icon green "Shared"
      "View" teal link
    Row 3:
      "Baby Patel"
      "2 Apr 2025"
      RED "Referral recommended"
      "Lisa Chen"
      Tick icon green "Shared"
      "View" teal link

═══════════════════════════════════════════════════════════
FIGMA FILE STRUCTURE
═══════════════════════════════════════════════════════════

Organise all screens into the following Figma pages:

Page 1: 🎨 Design System
  - Colour styles (all hex values above)
  - Text styles (all typography above)
  - Component library (all reusable components above)
  - Icon set (Heroicons or Phosphor)

Page 2: 📱 Patient App — 390x844px frames
  - Frame 1A-1: Welcome
  - Frame 1A-2: Account Creation
  - Frame 1A-3: Four-Stream Consent
  - Frame 1A-4: Wearable Connection
  - Frame 1A-5: Setup Complete
  - Frame 1B-1: Home Screen
  - Frame 1B-2: Daily Check-in
  - Frame 1B-3: Weekly EPDS Questionnaire
  - Frame 1C-1: Dual-Stream Timeline
  - Frame 1D-1: Crisis Resource Screen
  - Frame 1E-1: Family Health
  - Frame 1F-1: Profile and Settings

Page 3: 🖥️ Clinician Dashboard — 1440x900px frames
  - Frame 2A-1: SMART on FHIR Launch
  - Frame 2B-1: Patient Priority List
  - Frame 2C-1: Patient Detail Panel
  - Frame 2D-1: Alerts Feed

Page 4: 🖥️ MCH Nurse Portal — 1440x900px frames
  - Frame 3A-1: Portal Launch
  - Frame 3B-1: Infant Surveillance Dashboard
  - Frame 3C-1: Assessment Entry Form
  - Frame 3D-1: Assessment History

Page 5: 🔗 Prototype Flows
  Connect all frames with prototype arrows 
  to show navigation flow for each user:
  Patient: onboarding → home → check-in → 
    timeline → family → profile → crisis
  Clinician: launch → priority list → 
    patient detail → alerts
  MCH Nurse: launch → flag list → 
    assessment entry → history

═══════════════════════════════════════════════════════════
SHARED DATA ACROSS ALL INTERFACES
═══════════════════════════════════════════════════════════

Use these consistent patient and clinical data 
values across all three interfaces so screens 
tell a coherent story:

Patient: Sarah Mitchell
DOB: 12 March 1990
Status: 34 weeks postpartum
Current EPDS score: 16 (HIGH RISK — above threshold 13)
EPDS history: 8, 10, 13, 16 over last 4 weeks
Passive monitoring:
  HRV: 58ms (declining — was 72ms 4 weeks ago)
  Sleep: 5.8 hours (declining — was 7.4 hours)
  Steps: 3,200 per day (declining — was 6,800)
Last active check-in: 3 days ago
Infant: Baby Mitchell, DOB 12 Mar 2025, 12 weeks old
Infant flag: ACTIVE — amber/red for 3 weeks
Assigned midwife: Dr Emma Wilson
MCH nurse: Lisa Chen
Wearable: Apple Watch connected

Use this same data in:
  Patient app (Sarah's perspective)
  Clinician dashboard (Dr Wilson's view of Sarah)
  MCH nurse portal (Lisa's view of Baby Mitchell)

This ensures all three interfaces feel like 
parts of one connected system rather than 
three separate applications.
═══════════════════════════════════════════════════════════