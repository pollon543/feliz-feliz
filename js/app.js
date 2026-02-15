(function() {
      const heartEmojis = ['💖', '💕', '💗', '💝', '❤️', '🩷'];
      const flowers = ['🌹', '🌷', '🌸', '🌺', '💐', '🌻'];

      // ---------- UNIVERSO: estrellas en órbita, corazones, partículas ----------
      function createUniverse() {
        const field = document.getElementById('star-field');
        if (!field) return;
        field.innerHTML = '';

        // Órbitas de estrellas (círculos giratorios)
        const orbits = [
          { radius: 90, count: 8, speed: 80, class: 'orbit-slow' },
          { radius: 140, count: 12, speed: 55, class: 'orbit-slow' },
          { radius: 200, count: 16, speed: 45, class: 'orbit-medium' },
          { radius: 280, count: 20, speed: 35, class: 'orbit-medium' },
          { radius: 380, count: 24, speed: 28, class: 'orbit-fast' }
        ];

        orbits.forEach(function(orb) {
          var ring = document.createElement('div');
          ring.className = 'orbit-ring';
          ring.style.position = 'absolute';
          ring.style.left = '50%';
          ring.style.top = '50%';
          ring.style.width = '0';
          ring.style.height = '0';
          ring.style.transform = 'translate(-50%, -50%)';
          ring.style.animation = 'orbit ' + orb.speed + 's linear infinite';
          for (var s = 0; s < orb.count; s++) {
            var angle = (s / orb.count) * Math.PI * 2;
            var x = Math.cos(angle) * orb.radius;
            var y = Math.sin(angle) * orb.radius;
            var star = document.createElement('div');
            star.className = 'star twinkle ' + orb.class;
            star.style.width = (3 + Math.random() * 3) + 'px';
            star.style.height = star.style.width;
            star.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
            star.style.animationDelay = Math.random() * 3 + 's';
            ring.appendChild(star);
          }
          field.appendChild(ring);
        });

        // Estrellas fijas titilantes
        for (var i = 0; i < 120; i++) {
          var star = document.createElement('div');
          star.className = 'star twinkle';
          star.style.width = (1 + Math.random() * 2.5) + 'px';
          star.style.height = star.style.width;
          star.style.left = Math.random() * 100 + '%';
          star.style.top = Math.random() * 100 + '%';
          star.style.animationDelay = Math.random() * 4 + 's';
          field.appendChild(star);
        }

        // Corazones flotantes
        for (var i = 0; i < 35; i++) {
          var h = document.createElement('div');
          h.className = 'heart-universe';
          h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          h.style.left = Math.random() * 100 + '%';
          h.style.top = Math.random() * 100 + '%';
          h.style.animationDelay = Math.random() * 12 + 's';
          h.style.animationDuration = (8 + Math.random() * 8) + 's';
          field.appendChild(h);
        }

        // Puntos de luz
        for (var i = 0; i < 40; i++) {
          var dot = document.createElement('div');
          dot.className = 'light-dot';
          dot.style.width = (2 + Math.random() * 4) + 'px';
          dot.style.height = dot.style.width;
          dot.style.left = Math.random() * 100 + '%';
          dot.style.top = Math.random() * 100 + '%';
          dot.style.animationDelay = Math.random() * 25 + 's';
          field.appendChild(dot);
        }
      }

      // ---------- ÁRBOL: tronco, ramas, flores, escalar ----------
      var treeStarted = false;
      function createGrowingTree() {
        if (treeStarted) return;
        treeStarted = true;

        var wrapper = document.getElementById('tree-wrapper');
        var trunkEl = document.getElementById('tree-trunk');
        if (!wrapper || !trunkEl) return;

        wrapper.innerHTML = '';
        var trunk = document.createElement('div');
        trunk.className = 'tree-trunk';
        trunk.id = 'tree-trunk';
        wrapper.appendChild(trunk);

        requestAnimationFrame(function() {
          trunk.classList.add('grown');
        });

        var branchConfig = [
          { bottom: 160, rotation: -38, width: 75 },
          { bottom: 160, rotation: 38, width: 75 },
          { bottom: 130, rotation: -55, width: 65 },
          { bottom: 130, rotation: 55, width: 65 },
          { bottom: 100, rotation: -65, width: 58 },
          { bottom: 100, rotation: 65, width: 58 },
          { bottom: 72, rotation: -48, width: 50 },
          { bottom: 72, rotation: 48, width: 50 },
          { bottom: 48, rotation: -72, width: 42 },
          { bottom: 48, rotation: 72, width: 42 },
          { bottom: 28, rotation: -58, width: 35 },
          { bottom: 28, rotation: 58, width: 35 }
        ];

        setTimeout(function() {
          var trunkH = trunk.offsetHeight || 160;
          var scaleTree = trunkH / 160;
          branchConfig.forEach(function(b, i) {
            var bottom = Math.round(b.bottom * scaleTree);
            var width = Math.round(b.width * scaleTree);
            var branch = document.createElement('div');
            branch.className = 'branch';
            branch.style.bottom = bottom + 'px';
            branch.style.transform = 'translateX(-50%) rotate(' + b.rotation + 'deg)';
            branch.style.width = '0';
            branch.style.animationDelay = (i * 0.08) + 's';
            wrapper.appendChild(branch);
            requestAnimationFrame(function() {
              branch.classList.add('grown');
              branch.style.width = width + 'px';
            });
            b._bottom = bottom;
            b._width = width;
          });
        }, 2100);

        // Flores en los extremos de las ramas
        setTimeout(function() {
          var trunkH = trunk.offsetHeight || 160;
          var scaleTree = trunkH / 160;
          var wrapW = wrapper.offsetWidth || 320;
          var wrapH = wrapper.offsetHeight || 320;
          branchConfig.forEach(function(b, i) {
            var bottom = b._bottom != null ? b._bottom : Math.round(b.bottom * scaleTree);
            var width = b._width != null ? b._width : Math.round(b.width * scaleTree);
            var rad = (b.rotation * Math.PI) / 180;
            var endX = 50 + (Math.cos(rad) * width * 0.95) / wrapW * 100;
            var endY = 100 - (bottom / wrapH * 100) - (Math.sin(rad) * width * 0.95) / wrapH * 100;
            var flower = document.createElement('div');
            flower.className = 'tree-flower';
            flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            flower.style.left = endX + '%';
            flower.style.top = endY + '%';
            flower.style.marginLeft = '-11px';
            flower.style.marginTop = '-11px';
            flower.style.animationDelay = (i * 0.06) + 's';
            wrapper.appendChild(flower);
            requestAnimationFrame(function() {
              flower.classList.add('bloom');
            });
          });
        }, 3400);

        // Escalar árbol hasta llenar pantalla
        setTimeout(function() {
          var w = wrapper.offsetWidth || 320;
          var h = wrapper.offsetHeight || 320;
          var scale = Math.max(window.innerWidth / w, window.innerHeight / h) * 1.1;
          wrapper.style.transition = 'transform 2.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
          wrapper.style.transform = 'scale(' + scale + ')';
        }, 4200);

        setTimeout(function() {
          var btn = document.getElementById('tree-next-btn');
          if (btn) btn.classList.add('visible');
        }, 6200);
      }

      // ---------- Pantalla árbol/ramo: estrellas, corazones flotantes, corazones orbitando ----------
      function createTreeStarsHearts() {
        var container = document.getElementById('tree-stars-hearts-bg');
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < 400; i++) {
          var star = document.createElement('div');
          star.className = 'tree-star-dot twinkle';
          var size = 0.6 + Math.random() * 2;
          star.style.width = size + 'px';
          star.style.height = size + 'px';
          star.style.left = Math.random() * 100 + '%';
          star.style.top = Math.random() * 100 + '%';
          star.style.animationDelay = Math.random() * 2.5 + 's';
          star.style.animationDuration = (2 + Math.random() * 1.5) + 's';
          container.appendChild(star);
        }
        for (var i = 0; i < 120; i++) {
          var h = document.createElement('div');
          h.className = 'tree-heart-float';
          h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          h.style.left = Math.random() * 100 + '%';
          h.style.top = Math.random() * 100 + '%';
          h.style.animationDelay = Math.random() * 14 + 's';
          h.style.animationDuration = (10 + Math.random() * 8) + 's';
          h.style.fontSize = (0.75 + Math.random() * 0.6) + 'rem';
          container.appendChild(h);
        }
      }

      function createTreeHeartsOrbit() {
        var wrap = document.getElementById('tree-hearts-orbit-wrap');
        if (!wrap) return;
        wrap.innerHTML = '';
        var count = 36;
        var radiusPct = 48;
        for (var i = 0; i < count; i++) {
          var angle = (i / count) * Math.PI * 2;
          var leftPct = 50 + radiusPct * Math.cos(angle);
          var topPct = 50 + radiusPct * Math.sin(angle);
          var heart = document.createElement('div');
          heart.className = 'tree-heart-orbit';
          heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          heart.style.left = leftPct + '%';
          heart.style.top = topPct + '%';
          heart.style.animationDelay = (i * 0.05) + 's';
          wrap.appendChild(heart);
        }
        wrap.classList.add('visible');
      }

      // ---------- Botón redondo del universo: funciona con clic y toque en celular ----------
      var universeBtnLastTouch = 0;
      function handleUniverseButton(e) {
        var now = Date.now();
        if (e.type === 'click' && (now - universeBtnLastTouch) < 400) return;
        if (e.type === 'touchend') {
          universeBtnLastTouch = now;
          e.preventDefault();
        }
        var x = (e.clientX != null) ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
        var y = (e.clientY != null) ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
        createHeartBurst(x, y);
        document.getElementById('universe-screen').classList.remove('visible');
        document.getElementById('universe-screen').classList.add('hidden');
        document.getElementById('tree-screen').classList.remove('hidden');
        document.getElementById('tree-screen').classList.add('visible');
        createTreeStarsHearts();
      }
      var universeBtn = document.getElementById('universe-btn');
      if (universeBtn) {
        universeBtn.addEventListener('click', handleUniverseButton);
        universeBtn.addEventListener('touchend', handleUniverseButton, { passive: false });
      }

      function goToTreeScreen() {
        document.getElementById('universe-screen').classList.remove('visible');
        document.getElementById('universe-screen').classList.add('hidden');
        document.getElementById('tree-screen').classList.remove('hidden');
        document.getElementById('tree-screen').classList.add('visible');
        createTreeStarsHearts();
      }

      var verBtn = document.getElementById('universe-ver-btn');
      if (verBtn) {
        function handleVerClick(e) {
          e.preventDefault();
          e.stopPropagation();
          goToTreeScreen();
        }
        verBtn.addEventListener('click', handleVerClick);
        verBtn.addEventListener('touchend', handleVerClick, { passive: false });
      }

      document.getElementById('tree-open-btn').addEventListener('click', function() {
        this.classList.add('hidden');
        document.getElementById('tree-wrapper').style.display = 'none';
        var bouquetWrap = document.getElementById('tree-bouquet-wrap');
        bouquetWrap.classList.add('visible');
        createTreeHeartsOrbit();
        setTimeout(function() {
          var btn = document.getElementById('tree-next-btn');
          if (btn) btn.classList.add('visible');
        }, 800);
      });

      document.getElementById('back-from-tree').addEventListener('click', function() {
        document.getElementById('tree-screen').classList.remove('visible');
        document.getElementById('tree-screen').classList.add('hidden');
        document.getElementById('universe-screen').classList.remove('hidden');
        document.getElementById('universe-screen').classList.add('visible');
        var treeOpen = document.getElementById('tree-open-btn');
        var treeWrap = document.getElementById('tree-wrapper');
        var bouquetWrap = document.getElementById('tree-bouquet-wrap');
        var treeNext = document.getElementById('tree-next-btn');
        var orbitWrap = document.getElementById('tree-hearts-orbit-wrap');
        if (treeOpen) treeOpen.classList.remove('hidden');
        if (treeWrap) treeWrap.style.display = '';
        if (bouquetWrap) bouquetWrap.classList.remove('visible');
        if (treeNext) treeNext.classList.remove('visible');
        if (orbitWrap) { orbitWrap.classList.remove('visible'); orbitWrap.innerHTML = ''; }
      });

      document.getElementById('tree-next-btn').addEventListener('click', function() {
        document.getElementById('tree-screen').classList.remove('visible');
        document.getElementById('tree-screen').classList.add('hidden');
        document.getElementById('capybara-screen').classList.remove('hidden');
        document.getElementById('capybara-screen').classList.add('visible');
        initCapybaraScreen();
      });

      // ---------- Pantalla Capybaras: cielo, lluvia de corazones, corazón gigante, texto ----------
      var capybaraHeartInterval = null;
      var capybaraMessage = 'Juana Xiomara Mosqueira Cotrina, tu amistad es el regalo más hermoso que la vida puso en mi camino.';

      function createCapybaraSky() {
        var layer = document.getElementById('capybara-stars-layer');
        if (!layer) return;
        layer.innerHTML = '';
        for (var i = 0; i < 550; i++) {
          var star = document.createElement('div');
          star.className = 'capybara-star-dot twinkle';
          var size = 0.5 + Math.random() * 1.8;
          star.style.width = size + 'px';
          star.style.height = size + 'px';
          star.style.left = Math.random() * 100 + '%';
          star.style.top = Math.random() * 100 + '%';
          star.style.animationDelay = Math.random() * 2 + 's';
          star.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
          layer.appendChild(star);
        }
      }

      function createCapybaraOrbitStars() {
        var container = document.getElementById('capybara-orbit-stars');
        if (!container) return;
        container.innerHTML = '';
        var radiusPct = 48.08;
        var count = 80;
        for (var i = 0; i < count; i++) {
          var angle = (i / count) * Math.PI * 2;
          var leftPct = 50 + radiusPct * Math.cos(angle);
          var topPct = 50 + radiusPct * Math.sin(angle);
          var star = document.createElement('div');
          star.className = 'capybara-orbit-star';
          star.style.left = leftPct + '%';
          star.style.top = topPct + '%';
          star.style.marginLeft = '';
          star.style.marginTop = '';
          star.style.transform = 'translate(-50%, -50%)';
          container.appendChild(star);
        }
      }

      function typewriterHeartMessage() {
        var el = document.getElementById('heart-message');
        if (!el) return;
        el.classList.add('visible');
        el.innerHTML = '';
        var idx = 0;
        var speed = 38;
        function type() {
          if (idx < capybaraMessage.length) {
            el.innerHTML = capybaraMessage.substring(0, idx + 1) + '<span class="typing-cursor"></span>';
            idx++;
            setTimeout(type, speed);
          } else {
            el.innerHTML = capybaraMessage;
            document.getElementById('capybara-next-btn').classList.add('visible');
          }
        }
        type();
      }

      function initCapybaraScreen() {
        document.getElementById('heart-giant-svg').classList.remove('visible');
        document.getElementById('heart-message').classList.remove('visible');
        document.getElementById('heart-message').innerHTML = '';
        document.getElementById('capybara-orbit-stars').classList.remove('visible');
        document.getElementById('capybara-orbit-stars').innerHTML = '';
        document.getElementById('capybara-next-btn').classList.remove('visible');
        document.getElementById('hearts-column-left').innerHTML = '';
        document.getElementById('hearts-column-right').innerHTML = '';

        createCapybaraSky();
        createCapybaraOrbitStars();

        var leftCol = document.getElementById('hearts-column-left');
        var rightCol = document.getElementById('hearts-column-right');
        var heartCount = 0;
        var maxHearts = 72;
        capybaraHeartInterval = setInterval(function() {
          heartCount++;
          for (var j = 0; j < 8; j++) {
            var hl = document.createElement('div');
            hl.className = 'flying-heart-capy';
            hl.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            hl.style.animationDelay = (j * 25) + 'ms';
            leftCol.appendChild(hl);
            setTimeout(function(el) { return function() { if (el.parentNode) el.parentNode.removeChild(el); }; }(hl), 2100);
            var hr = document.createElement('div');
            hr.className = 'flying-heart-capy';
            hr.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            hr.style.animationDelay = (j * 25) + 'ms';
            rightCol.appendChild(hr);
            setTimeout(function(el) { return function() { if (el.parentNode) el.parentNode.removeChild(el); }; }(hr), 2100);
          }
          if (heartCount >= maxHearts) {
            clearInterval(capybaraHeartInterval);
            capybaraHeartInterval = null;
          }
        }, 85);

        setTimeout(function() {
          document.getElementById('heart-giant-svg').classList.add('visible');
          document.getElementById('capybara-orbit-stars').classList.add('visible');
        }, 3800);

        setTimeout(function() {
          typewriterHeartMessage();
        }, 6000);
      }

      document.getElementById('back-from-capybara').addEventListener('click', function() {
        if (capybaraHeartInterval) clearInterval(capybaraHeartInterval);
        document.getElementById('capybara-screen').classList.remove('visible');
        document.getElementById('capybara-screen').classList.add('hidden');
        document.getElementById('tree-screen').classList.remove('hidden');
        document.getElementById('tree-screen').classList.add('visible');
      });

      document.getElementById('capybara-next-btn').addEventListener('click', function() {
        if (capybaraHeartInterval) clearInterval(capybaraHeartInterval);
        document.getElementById('capybara-screen').classList.remove('visible');
        document.getElementById('capybara-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        createParticles();
        initReveal();
        window.scrollTo(0, 0);
      });

      // ---------- Main content: partículas y reveal ----------
      function createParticles() {
        var container = document.getElementById('particles-bg');
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < 25; i++) {
          var p = document.createElement('div');
          p.className = 'particle';
          var size = 60 + Math.random() * 120;
          p.style.width = size + 'px';
          p.style.height = size + 'px';
          p.style.left = Math.random() * 100 + '%';
          p.style.top = Math.random() * 100 + '%';
          p.style.animationDelay = Math.random() * 20 + 's';
          p.style.animationDuration = (15 + Math.random() * 15) + 's';
          container.appendChild(p);
        }
        for (var i = 0; i < 18; i++) {
          var h = document.createElement('div');
          h.className = 'heart-float';
          h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          h.style.left = Math.random() * 100 + '%';
          h.style.top = Math.random() * 100 + '%';
          h.style.animationDelay = Math.random() * 15 + 's';
          h.style.animationDuration = (10 + Math.random() * 10) + 's';
          container.appendChild(h);
        }
      }

      function initReveal() {
        var sections = document.querySelectorAll('#main-content .reveal');
        sections.forEach(function(el) {
          el.classList.add('visible');
        });
        var grid = document.getElementById('phrases-section');
        if (grid) grid.classList.add('visible');
      }

      // Burst de corazones (en botón universo)
      function createHeartBurst(x, y) {
        var container = document.getElementById('heart-burst');
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < 12; i++) {
          var angle = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
          var dist = 80 + Math.random() * 100;
          var tx = Math.cos(angle) * dist;
          var ty = Math.sin(angle) * dist;
          var span = document.createElement('span');
          span.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
          span.style.left = x + 'px';
          span.style.top = y + 'px';
          span.style.setProperty('--tx', tx + 'px');
          span.style.setProperty('--ty', ty + 'px');
          container.appendChild(span);
        }
        setTimeout(function() { container.innerHTML = ''; }, 1300);
      }

      createUniverse();
    })();