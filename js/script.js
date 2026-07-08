document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Heatmap Grid Generation, Animation, and Tooltips
     ========================================================================== */
  const heatmapGrid = document.querySelector('.heatmap-grid');
  
  if (heatmapGrid) {
    // Tooltip Element Setup
    const tooltip = document.createElement('div');
    tooltip.classList.add('heatmap-tooltip');
    document.body.appendChild(tooltip);

    const showTooltip = (cell) => {
      tooltip.textContent = cell.getAttribute('aria-label');
      tooltip.classList.add('is-visible');
      
      const rect = cell.getBoundingClientRect();
      let left = rect.left + (rect.width / 2);
      const top = rect.top + window.scrollY;
      
      // Prevent rendering offscreen (left or right bounds)
      tooltip.style.left = `${left}px`;
      // We apply standard top, if it gets too close to left or right, adjust left.
      // Wait for next frame to get tooltip dimensions
      requestAnimationFrame(() => {
        const tRect = tooltip.getBoundingClientRect();
        if (tRect.left < 10) {
          tooltip.style.left = `${tRect.width / 2 + 10}px`;
        } else if (tRect.right > window.innerWidth - 10) {
          tooltip.style.left = `${window.innerWidth - (tRect.width / 2) - 10}px`;
        }
      });
      
      tooltip.style.top = `${top}px`;
    };

    const hideTooltip = () => {
      tooltip.classList.remove('is-visible');
    };

    // Generate Cells
    const totalCells = 7 * 20; // 7 rows x 20 columns = 140 cells
    const sampleTextsFilled = ["logged", "crushed it", "read 20 pages", "gym done", "meditated"];
    const sampleTextsEmpty = ["rest day", "skipped", "forgot"];

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('button'); // Semantically a button for focus
      cell.classList.add('heatmap-cell');
      
      const col = Math.floor(i / 7);
      const row = i % 7;
      cell.dataset.col = col;
      cell.dataset.row = row;
      
      // Simulate streak
      const isFilled = Math.random() > 0.4;
      const dayNum = i + 1;
      
      if (isFilled) {
        const opacity = 0.3 + Math.random() * 0.7;
        cell.style.backgroundColor = `rgba(255, 210, 63, ${opacity})`;
        const flavor = sampleTextsFilled[Math.floor(Math.random() * sampleTextsFilled.length)];
        cell.setAttribute('aria-label', `Day ${dayNum} — ${flavor}`);
      } else {
        const flavor = sampleTextsEmpty[Math.floor(Math.random() * sampleTextsEmpty.length)];
        cell.setAttribute('aria-label', `Day ${dayNum} — ${flavor}`);
      }
      
      // Event Listeners for Tooltip
      cell.addEventListener('mouseenter', () => showTooltip(cell));
      cell.addEventListener('mouseleave', hideTooltip);
      cell.addEventListener('focus', () => showTooltip(cell));
      cell.addEventListener('blur', hideTooltip);

      heatmapGrid.appendChild(cell);
    }

    if (!prefersReducedMotion) {
      // 3-Beat Orchestrated Sequence
      const cells = heatmapGrid.querySelectorAll('.heatmap-cell');
      let maxDelay = 0;

      // Beat 1: Wave
      cells.forEach(cell => {
        const col = parseInt(cell.dataset.col);
        const delay = (col * 50) + (Math.random() * 100);
        if (delay > maxDelay) maxDelay = delay;
        
        setTimeout(() => {
          cell.classList.add('animate-in');
        }, delay);
      });

      // Beat 2: Spark Travel (fires exactly as the wave reaches the end)
      const spark = document.querySelector('.spark-glyph');
      const drawLine = document.querySelector('.draw-line');
      
      if (spark && drawLine) {
        setTimeout(() => {
          spark.classList.add('animate-in');
          
          // Beat 3: Hand-drawn underline (fires just as spark arrives, ~900ms into spark animation)
          setTimeout(() => {
            drawLine.classList.add('animate-in');
          }, 900);
          
        }, maxDelay);
      }

      // Idle state: Random pulse after sequence completes
      setTimeout(() => {
        const filledCells = Array.from(cells).filter(c => c.style.backgroundColor !== '');
        if (filledCells.length > 0) {
          const randomCell = filledCells[Math.floor(Math.random() * filledCells.length)];
          randomCell.classList.add('pulse');
        }
      }, maxDelay + 1500);

    } else {
      // Reduced motion fallback
      heatmapGrid.querySelectorAll('.heatmap-cell').forEach(cell => {
        cell.style.opacity = '1';
      });
      const drawLine = document.querySelector('.draw-line');
      if (drawLine) drawLine.style.strokeDashoffset = '0';
    }
  }

  /* ==========================================================================
     2. Navigation Scroll State
     ========================================================================== */
  const header = document.querySelector('header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize on load
  }

  /* ==========================================================================
     3. Mobile Navigation Menu
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scrim = document.querySelector('.mobile-scrim');

  const closeMenu = () => {
    if (menuToggle && navLinks && scrim) {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-active');
      scrim.classList.remove('is-active');
    }
  };

  const openMenu = () => {
    if (menuToggle && navLinks && scrim) {
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('is-active');
      scrim.classList.add('is-active');
    }
  };

  if (menuToggle && navLinks && scrim) {
    menuToggle.addEventListener('click', () => {
      if (menuToggle.classList.contains('is-active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    scrim.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.classList.contains('is-active')) {
        closeMenu();
      }
    });
    
    // Close when a link inside the mobile nav is clicked
    const internalNavLinks = navLinks.querySelectorAll('a');
    internalNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ==========================================================================
     4. Stats Ticker Count-up (Fires exactly once)
     ========================================================================== */
  const statsCounters = document.querySelectorAll('.stat-number');
  if (statsCounters.length > 0 && !prefersReducedMotion) {
    statsCounters.forEach(counter => {
      counter.dataset.target = counter.innerText;
      const valStr = counter.innerText.replace(/[^0-9.]/g, '');
      counter.dataset.value = valStr;
      counter.innerText = '0';
      counter.dataset.animated = 'false'; // Track animation state
    });

    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          
          if (counter.dataset.animated === 'true') return;
          counter.dataset.animated = 'true'; // Set flag so it never fires again
          
          const targetValue = parseFloat(counter.dataset.value);
          const originalText = counter.dataset.target;
          
          let startValue = 0;
          const duration = 1500;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress); // easeOutQuad
            const currentVal = startValue + (targetValue - startValue) * easeProgress;
            
            if (originalText.includes('.')) {
              counter.innerText = currentVal.toFixed(1) + originalText.replace(/[0-9.]/g, '');
            } else {
              counter.innerText = Math.floor(currentVal).toLocaleString() + originalText.replace(/[0-9,.]/g, '');
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.innerText = originalText;
            }
          };

          requestAnimationFrame(updateCounter);
          obs.unobserve(counter); // Disconnect this specific element entirely
        }
      });
    }, { threshold: 0.5 });

    statsCounters.forEach(counter => statsObserver.observe(counter));
  }

  /* ==========================================================================
     5. How It Works - Scroll Reveal
     ========================================================================== */
  const stepRows = document.querySelectorAll('.step-row');
  if (stepRows.length > 0 && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const index = Array.from(stepRows).indexOf(row);
          // Staggered ~80ms per row
          setTimeout(() => {
            row.classList.add('is-revealed');
          }, index * 80);
          
          obs.unobserve(row);
        }
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

    stepRows.forEach(row => revealObserver.observe(row));
  } else if (prefersReducedMotion) {
    stepRows.forEach(row => row.classList.add('is-revealed'));
  }

  /* ==========================================================================
     6. Page Cross-fade Navigation
     ========================================================================== */
  const navLinksList = document.querySelectorAll('a');

  navLinksList.forEach(link => {
    // Only apply to HTML links, excluding hashes, downloads, external, and placeholders
    const isInternal = link.href && !link.href.includes('#') && (link.protocol === 'file:' || link.host === window.location.host);
    
    if (
      isInternal && 
      !link.hasAttribute('download') &&
      link.target !== '_blank'
    ) {
      link.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) return; 
        
        e.preventDefault();
        const destination = link.href;
        document.body.classList.add('fade-out');
        
        setTimeout(() => {
          window.location.href = destination;
        }, 200); 
      });
    }
  });

  /* ==========================================================================
     7. Contact Form Validation
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const successMsg = document.querySelector('.form-success');
      
      let isValid = true;
      
      if (!name || !name.value.trim()) isValid = false;
      if (!message || !message.value.trim()) isValid = false;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value)) {
        isValid = false;
        email.focus();
      }
      
      if (isValid) {
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
      }
    });
  }
});
