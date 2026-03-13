# Visual Testing Checklist

## Goal
Verify that `http://localhost:3000` (Next.js) looks EXACTLY like `index.html` (static)

---

## Setup

1. **Open Static HTML**
   - Navigate to: `C:\Users\Jaynielilie\Documents\Projects\CYVE\index.html`
   - Open in browser (double-click or right-click → Open with → Browser)

2. **Open Next.js App**
   - Navigate to: `http://localhost:3000`
   - Dev server should be running

3. **Position Windows Side-by-Side**
   - Static HTML on left
   - Next.js on right
   - Same zoom level (100%)

---

## Visual Comparison Checklist

### ✅ Navigation Bar
- [ ] Logo size and position match
- [ ] Logo image displays correctly
- [ ] Navigation links (Home, League, About) in same position
- [ ] Login/Signup buttons styled identically
- [ ] Hover effects work the same
- [ ] Mobile menu toggle appears at same breakpoint

### ✅ Hero Section
- [ ] "CYVE" title size and color match (#f5be1e gold)
- [ ] Title letter-spacing identical
- [ ] Search bar width and height match
- [ ] Search icon displays correctly
- [ ] Search placeholder text matches
- [ ] "CREATE. CONNECT. PROTECT." tagline position and size
- [ ] Overall spacing and padding identical

### ✅ Sub-Hero Section
- [ ] Triangle graphic displays correctly
- [ ] "build, your, future" text styling matches
- [ ] "Your Roadmap Starts Here" heading matches
- [ ] Description text formatting identical
- [ ] Two-column layout at same breakpoint
- [ ] Spacing between elements matches

### ✅ Team Sections
- [ ] Three team cards display (Red, Blue, Purple)
- [ ] Background images load correctly
- [ ] Background images darkened (brightness 30%)
- [ ] Team focal images display correctly
- [ ] Border styling matches (gold border, rounded corners)
- [ ] Team labels positioned identically
- [ ] Label text styling matches
- [ ] Card shadows and effects identical
- [ ] Spacing between cards matches

### ✅ Footer
- [ ] Footer layout matches
- [ ] Contact information displays correctly
- [ ] Icons display correctly
- [ ] Link groups positioned identically
- [ ] Copyright text matches
- [ ] Footer background color matches

### ✅ Typography
- [ ] Montserrat font loads correctly
- [ ] Inter font loads correctly
- [ ] Font weights match (400, 700, 900)
- [ ] Line heights identical
- [ ] Letter spacing matches

### ✅ Colors
- [ ] Background: Black (#000000) ✓
- [ ] Primary: Gold (#f5be1e) ✓
- [ ] Text: White (#ffffff) ✓
- [ ] Dimmed text: rgba(255, 255, 255, 0.7) ✓

### ✅ Responsive Design
Test at these breakpoints:

**Desktop (1920px)**
- [ ] Layout matches
- [ ] All elements visible
- [ ] Spacing correct

**Laptop (1366px)**
- [ ] Layout adjusts identically
- [ ] No horizontal scroll
- [ ] Elements scale properly

**Tablet (768px)**
- [ ] Mobile menu appears
- [ ] Layout stacks correctly
- [ ] Images scale properly

**Mobile (375px)**
- [ ] All content accessible
- [ ] Touch targets adequate
- [ ] Text readable

### ✅ Interactions
- [ ] Search bar focus state matches
- [ ] Button hover effects identical
- [ ] Link hover effects match
- [ ] Mobile menu animation works
- [ ] Smooth scrolling behavior

### ✅ Images
- [ ] Logo (52_31.png) displays
- [ ] Search icon (52_40.png) displays
- [ ] Team background (62_6.png) displays
- [ ] Red team image (62_7.png) displays
- [ ] Blue team image (blue_team.png) displays
- [ ] Purple team image (purple_team.png) displays
- [ ] Footer icons display
- [ ] All images load without errors

---

## Known Differences (Expected)

These differences are intentional and expected:

### Dynamic Features (Next.js Only)
✅ Career search functionality works
✅ User authentication available
✅ React components render dynamically
✅ Server-side rendering active

### Static Features (HTML Only)
✅ Instant page load
✅ No JavaScript framework overhead
✅ Can work offline

---

## Testing Tools

### Browser DevTools
1. **Inspect Element** - Compare HTML structure
2. **Computed Styles** - Compare CSS values
3. **Network Tab** - Check resource loading
4. **Console** - Check for errors

### Visual Comparison
1. **Screenshot Both Pages**
   - Use browser screenshot tool
   - Compare side-by-side
   - Look for pixel differences

2. **Overlay Test**
   - Take screenshots
   - Use image editing tool
   - Overlay with 50% opacity
   - Check for misalignments

---

## Common Issues & Fixes

### Issue: Colors Don't Match
**Fix**: Check CSS variables in `design-tokens.css`

### Issue: Fonts Look Different
**Fix**: Verify Google Fonts import in both files

### Issue: Images Not Loading
**Fix**: Check image paths (Next.js uses `/public/` folder)

### Issue: Layout Shifts
**Fix**: Compare padding/margin values in DevTools

### Issue: Hover Effects Different
**Fix**: Check transition properties in CSS

---

## Acceptance Criteria

✅ **Visual Match**: 95%+ identical appearance  
✅ **No Console Errors**: Both pages load without errors  
✅ **Responsive**: Both work on all screen sizes  
✅ **Performance**: Next.js loads in < 2 seconds  
✅ **Functionality**: All interactive elements work  

---

## Report Issues

If you find visual differences:

1. **Take Screenshots**
   - Static HTML version
   - Next.js version
   - Highlight the difference

2. **Note Details**
   - Browser and version
   - Screen size
   - Specific element affected
   - Expected vs actual behavior

3. **Create Issue**
   - Document in GitHub Issues
   - Tag with `visual-bug`
   - Include screenshots

---

## Testing Status

**Date Tested**: _____________  
**Tested By**: _____________  
**Browser**: _____________  
**Result**: ⬜ Pass / ⬜ Fail  

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Next Steps After Testing

✅ **If All Tests Pass**:
- Mark Phase 1 complete
- Move to Phase 2 (Security)
- Begin backend integration

⚠️ **If Tests Fail**:
- Document issues
- Fix visual discrepancies
- Re-test
- Repeat until passing

---

**Happy Testing! 🎨✨**
