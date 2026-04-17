// TDD Test Suite: Information Layering (方案二)
// =============================================
// 
// Test Strategy: Cross-validate implementation against 3-layer design spec
// 
// LAYER 1: Conclusion Priority (always visible, 2rem+ font)
// -------------------------------------------------------------------
// Test 1.1: Conclusion text is prominently displayed
// Expect: <div class="layer-conclusion"> contains key money value
// 
// Test 1.2: Conclusion font size >= 2rem
// Expect: computed font-size >= 2rem for .layer-conclusion
// 
// Test 1.3: No hover/click required to see conclusion
// Expect: .layer-conclusion has no .collapsed or .hidden class
// 
// LAYER 2: Comparison Table (click to expand)
// -------------------------------------------------------------------
// Test 2.1: Comparison table is collapsed by default
// Expect: .layer-2 has class .collapsed or max-height near 0
// 
// Test 2.2: Click expands to show 3-mode comparison
// Action: Click toggle button
// Expect: .layer-2.expanded or max-height > 200px
// 
// Test 2.3: Three modes visible after expansion
// Expect: Contains "Lucro Real", "Lucro Presumido", "低報" text
// 
// LAYER 3: Deep Analysis (scroll to unlock)
// -------------------------------------------------------------------
// Test 3.1: Formula derivation is blurred/hidden
// Expect: .layer-3 has class .locked or opacity < 0.5
// 
// Test 3.2: Scroll unlocks full content
// Action: Scroll to .layer-3
// Expect: .layer-3.unlocked or opacity 1
// 
// Test 3.3: CBS/IBS deduction logic available
// Expect: Contains "CBS" and "IBS" calculation explanation
// 
// CROSS-VALIDATION: Tests work across devices
// -------------------------------------------------------------------
// Test 4.1: Mobile layer priority works
// Expect: @media (max-width: 768px) shows L1 only
// 
// Test 4.2: Desktop shows all layers
// Expect: @media (min-width: 1024px) expands L2 by default
// 
// Test 4.3: No broken HTML in output
// Expect: No "&x3C;" or "&x3E;" strings in rendered HTML
// 
// =============================================
// RUN: npm run test:layering
// =============================================