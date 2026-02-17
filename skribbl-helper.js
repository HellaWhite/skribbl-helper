// Skribbl.io Word Helper - External Script
(function() {
    'use strict';
    
    const wordLists = {
        single: [
            'cat', 'dog', 'house', 'tree', 'car', 'sun', 'moon', 'star', 'fish', 'bird',
            'book', 'chair', 'table', 'door', 'window', 'phone', 'computer', 'flower', 'rainbow', 'butterfly',
            'elephant', 'giraffe', 'monkey', 'tiger', 'lion', 'bear', 'snake', 'turtle', 'rabbit', 'horse',
            'pizza', 'burger', 'apple', 'banana', 'orange', 'grape', 'watermelon', 'strawberry', 'cookie', 'cake',
            'icecream', 'chocolate', 'candy', 'bread', 'cheese', 'milk', 'water', 'coffee', 'tea', 'juice',
            'soda', 'guitar', 'piano', 'drums', 'trumpet', 'violin', 'microphone', 'camera', 'television', 'radio',
            'clock', 'watch', 'lamp', 'couch', 'bed', 'pillow', 'blanket', 'towel', 'soap', 'shampoo',
            'toothbrush', 'mirror', 'scissors', 'pencil', 'eraser', 'ruler', 'backpack', 'umbrella', 'glasses', 'hat',
            'shoes', 'shirt', 'pants', 'dress', 'jacket', 'gloves', 'scarf', 'sock', 'ring', 'necklace',
            'crown', 'sword', 'shield', 'bow', 'arrow', 'hammer', 'screwdriver', 'wrench', 'ladder', 'rope',
            'basket', 'bucket', 'bottle', 'cup', 'plate', 'fork', 'spoon', 'knife', 'pot', 'pan',
            'oven', 'fridge', 'microwave', 'blender', 'toaster', 'grill', 'boat', 'ship', 'airplane', 'helicopter',
            'rocket', 'train', 'bicycle', 'motorcycle', 'truck', 'bus', 'fire', 'smoke', 'cloud', 'lightning',
            'thunder', 'rain', 'snow', 'ice', 'wind', 'earthquake', 'volcano', 'mountain', 'hill', 'valley',
            'desert', 'forest', 'jungle', 'beach', 'ocean', 'river', 'lake', 'pond', 'island', 'bridge',
            'castle', 'tower', 'church', 'hospital', 'school', 'library', 'museum', 'bank', 'store', 'restaurant',
            'hotel', 'farm', 'barn', 'fence', 'gate', 'garden', 'playground', 'park', 'zoo', 'circus',
            'fair', 'carnival', 'rodeo', 'concert', 'theater', 'stadium', 'gym', 'pool', 'rink', 'court',
            'field', 'track', 'race', 'game', 'sport', 'ball', 'bat', 'glove', 'helmet', 'trophy',
            'medal', 'flag', 'team', 'player', 'coach', 'referee', 'crowd', 'fan', 'cheer', 'dance',
            'music', 'song', 'beat', 'note', 'chord', 'melody', 'harmony', 'rhythm', 'tempo', 'voice',
            'singer', 'band', 'stage', 'light', 'sound', 'speaker', 'screen', 'movie', 'film', 'show',
            'actor', 'director', 'action', 'drama', 'comedy', 'horror', 'mystery', 'romance', 'fantasy', 'adventure',
            'western', 'thriller', 'cartoon', 'anime', 'hero', 'villain', 'monster', 'ghost', 'zombie', 'vampire',
            'witch', 'wizard', 'fairy', 'dragon', 'unicorn', 'mermaid', 'giant', 'dwarf', 'elf', 'goblin',
            'troll', 'ogre', 'demon', 'angel', 'knight', 'king', 'queen', 'prince', 'princess', 'warrior',
            'archer', 'mage', 'thief', 'ninja', 'pirate', 'cowboy', 'astronaut', 'doctor', 'nurse', 'teacher',
            'student', 'artist', 'painter', 'sculptor', 'writer', 'poet', 'author', 'chef', 'baker', 'farmer',
            'carpenter', 'plumber', 'electrician', 'mechanic', 'driver', 'pilot', 'sailor', 'soldier', 'police', 'firefighter',
            'scientist', 'engineer', 'programmer', 'designer', 'musician', 'dancer', 'athlete', 'swimmer', 'runner', 'jumper',
            'climber', 'skier', 'skater', 'surfer', 'diver', 'boxer', 'wrestler', 'fighter', 'racer'
        ],
        multi: [
            'hot dog', 'ice cream', 'fire truck', 'police car', 'school bus', 'video game', 'credit card', 'cell phone',
            'laptop computer', 'coffee cup', 'wine glass', 'tennis ball', 'basketball hoop', 'soccer ball', 'baseball bat', 'golf club',
            'fishing rod', 'swimming pool', 'roller coaster', 'ferris wheel', 'merry go round', 'bumper car', 'haunted house', 'candy cane',
            'gingerbread man', 'santa claus', 'easter bunny', 'tooth fairy', 'teddy bear', 'rocking horse', 'jack in the box', 'rubiks cube',
            'lego brick', 'toy car', 'stuffed animal', 'action figure', 'barbie doll', 'chess board', 'playing card', 'dice roll',
            'coin flip', 'rock paper scissors', 'tic tac toe', 'hide and seek', 'simon says', 'red light green light', 'duck duck goose', 'musical chairs',
            'hot potato', 'freeze tag', 'capture the flag', 'treasure hunt', 'scavenger hunt', 'egg hunt', 'costume party', 'birthday cake',
            'wedding cake', 'baby shower', 'bridal shower', 'graduation cap', 'report card', 'science fair', 'spelling bee', 'talent show',
            'fashion show', 'beauty pageant', 'dog show', 'cat show', 'horse race', 'car race', 'boat race', 'bike race',
            'foot race', 'relay race', 'marathon run', 'obstacle course', 'triathlon race', 'decathlon event', 'jumping jack', 'push up',
            'sit up', 'pull up', 'chin up', 'leg lift', 'arm curl', 'bench press', 'squat lift', 'dead lift',
            'mountain climber', 'burpee exercise', 'plank hold', 'bridge pose', 'tree pose', 'warrior pose', 'downward dog', 'child pose',
            'cobra pose', 'lotus position', 'meditation pose', 'tai chi', 'kung fu', 'karate chop', 'roundhouse kick', 'spinning kick',
            'flying kick', 'drop kick', 'body slam', 'pile driver', 'clothes line', 'choke hold', 'arm bar', 'leg lock',
            'head lock', 'full nelson', 'bear hug', 'irish whip', 'figure four', 'sleeper hold', 'boston crab', 'dragon screw',
            'tiger knee', 'monkey flip', 'gorilla press', 'elephant splash', 'snake eyes', 'spider walk', 'crab walk', 'frog jump',
            'bunny hop', 'kangaroo kick', 'donkey kick', 'chicken dance', 'turkey trot', 'penguin walk', 'flamingo stand', 'swan dive',
            'eagle spread', 'hawk eye', 'cat stretch', 'dog pound', 'mouse trap', 'rat race', 'pig pen', 'cow bell',
            'horse shoe', 'fish hook', 'shark fin', 'whale tail', 'dolphin jump', 'seal clap', 'walrus flop', 'octopus arm',
            'jellyfish float', 'starfish pose', 'sea horse', 'sea lion', 'sea turtle', 'sea urchin', 'sea weed', 'coral reef',
            'tidal wave', 'rip tide', 'high tide', 'low tide', 'rough sea', 'calm water', 'still pond', 'running water',
            'flowing river', 'rushing stream', 'babbling brook', 'water fall', 'rain drop', 'snow flake', 'ice berg', 'glacier ice',
            'frozen lake', 'melting snow', 'spring thaw', 'summer heat', 'autumn leaf', 'winter cold', 'warm breeze', 'cool wind',
            'hot air', 'cold front', 'storm cloud', 'thunder storm', 'light rain', 'heavy rain', 'acid rain', 'freezing rain',
            'sleet fall', 'hail storm', 'dust storm', 'sand storm', 'wind storm', 'ice storm', 'snow storm', 'blizzard warning',
            'tornado warning', 'hurricane warning', 'flood warning', 'drought warning'
        ]
    };

    function getCluePattern() {
        const clueElement = document.querySelector('.word');
        if (!clueElement) return null;
        return clueElement.textContent.trim();
    }

    function analyzePattern(pattern) {
        if (!pattern || pattern === '') return null;
        
        const wordCount = (pattern.match(/\s+/g) || []).length + 1;
        const totalLength = pattern.replace(/\s+/g, '').length;
        
        return {
            wordCount,
            totalLength,
            pattern
        };
    }

    function filterWords(analysis) {
        if (!analysis) return { single: [], multi: [] };
        
        const filtered = {
            single: [],
            multi: []
        };

        if (analysis.wordCount === 1) {
            // Filter single words
            wordLists.single.forEach(word => {
                if (word.replace(/\s+/g, '').length === analysis.totalLength) {
                    filtered.single.push(word);
                }
            });
        } else {
            // Filter multi-word phrases
            wordLists.multi.forEach(word => {
                const wordParts = word.split(' ');
                if (wordParts.length === analysis.wordCount) {
                    const lengths = wordParts.map(w => w.length);
                    const patternParts = analysis.pattern.split(/\s+/).map(p => p.length);
                    
                    if (JSON.stringify(lengths) === JSON.stringify(patternParts)) {
                        filtered.multi.push(word);
                    }
                }
            });
        }

        return filtered;
    }

    function createUI(filtered, analysis) {
        // Remove existing UI if present
        let existingUI = document.getElementById('skribbl-helper-ui');
        if (existingUI) existingUI.remove();

        const ui = document.createElement('div');
        ui.id = 'skribbl-helper-ui';
        ui.style.cssText = 'position:fixed;top:10px;right:10px;background:white;border:3px solid #667eea;border-radius:15px;padding:20px;max-width:350px;max-height:80vh;overflow-y:auto;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,0.3);font-family:Arial,sans-serif;';

        // Title
        const title = document.createElement('div');
        title.style.cssText = 'font-size:20px;font-weight:bold;color:#667eea;margin-bottom:15px;text-align:center;border-bottom:2px solid #667eea;padding-bottom:10px;';
        title.textContent = '🎨 Word Helper';
        ui.appendChild(title);

        // Pattern info
        if (analysis) {
            const info = document.createElement('div');
            info.style.cssText = 'background:#f8f9ff;padding:10px;border-radius:8px;margin-bottom:15px;font-size:14px;color:#333;';
            info.innerHTML = `<strong>Pattern:</strong> ${analysis.pattern}<br><strong>Words:</strong> ${analysis.wordCount}<br><strong>Length:</strong> ${analysis.totalLength}`;
            ui.appendChild(info);
        }

        // Single words section
        if (filtered.single.length > 0) {
            const singleTitle = document.createElement('div');
            singleTitle.style.cssText = 'font-size:16px;font-weight:bold;color:#764ba2;margin-bottom:10px;';
            singleTitle.textContent = `📝 Single Words (${filtered.single.length})`;
            ui.appendChild(singleTitle);

            filtered.single.forEach(word => {
                const wordEl = document.createElement('div');
                wordEl.style.cssText = 'background:#f0f0ff;padding:8px 12px;margin:5px 0;border-radius:8px;border-left:4px solid #667eea;cursor:pointer;font-size:14px;transition:transform 0.2s;';
                wordEl.textContent = word;
                wordEl.onmouseover = () => wordEl.style.transform = 'translateX(5px)';
                wordEl.onmouseout = () => wordEl.style.transform = 'translateX(0)';
                wordEl.onclick = () => {
                    navigator.clipboard.writeText(word);
                    wordEl.style.background = '#d4edda';
                    setTimeout(() => wordEl.style.background = '#f0f0ff', 1000);
                };
                ui.appendChild(wordEl);
            });
        }

        // Multi words section
        if (filtered.multi.length > 0) {
            if (filtered.single.length > 0) {
                const divider = document.createElement('div');
                divider.style.cssText = 'height:2px;background:linear-gradient(90deg,#667eea,#764ba2);margin:15px 0;border-radius:2px;';
                ui.appendChild(divider);
            }

            const multiTitle = document.createElement('div');
            multiTitle.style.cssText = 'font-size:16px;font-weight:bold;color:#764ba2;margin-bottom:10px;';
            multiTitle.textContent = `📝 Multi Words (${filtered.multi.length})`;
            ui.appendChild(multiTitle);

            filtered.multi.forEach(word => {
                const wordEl = document.createElement('div');
                wordEl.style.cssText = 'background:#fff0f0;padding:8px 12px;margin:5px 0;border-radius:8px;border-left:4px solid #764ba2;cursor:pointer;font-size:14px;transition:transform 0.2s;';
                wordEl.textContent = word;
                wordEl.onmouseover = () => wordEl.style.transform = 'translateX(5px)';
                wordEl.onmouseout = () => wordEl.style.transform = 'translateX(0)';
                wordEl.onclick = () => {
                    navigator.clipboard.writeText(word);
                    wordEl.style.background = '#d4edda';
                    setTimeout(() => wordEl.style.background = '#fff0f0', 1000);
                };
                ui.appendChild(wordEl);
            });
        }

        // No results message
        if (filtered.single.length === 0 && filtered.multi.length === 0) {
            const noResults = document.createElement('div');
            noResults.style.cssText = 'text-align:center;color:#999;padding:20px;font-size:14px;';
            noResults.textContent = 'No matching words found 😢';
            ui.appendChild(noResults);
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✖ Close';
        closeBtn.style.cssText = 'width:100%;padding:12px;margin-top:15px;background:#667eea;color:white;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;transition:background 0.2s;';
        closeBtn.onmouseover = () => closeBtn.style.background = '#5568d3';
        closeBtn.onmouseout = () => closeBtn.style.background = '#667eea';
        closeBtn.onclick = () => ui.remove();
        ui.appendChild(closeBtn);

        document.body.appendChild(ui);
    }

    // Main execution
    const pattern = getCluePattern();
    if (!pattern) {
        alert('⚠️ Could not find the word clue! Make sure you\'re on skribbl.io and a round is active.');
        return;
    }

    const analysis = analyzePattern(pattern);
    const filtered = filterWords(analysis);
    createUI(filtered, analysis);
})();
