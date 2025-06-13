let quotes = [];

// Load quotes from JSON file
fetch('developer_jokes.json')
    .then(response => response.json())
    .then(data => {
        quotes = data;
    })
    .catch(error => {
        console.error('Error loading quotes:', error);
        // Fallback quotes if JSON fails to load
        quotes = [
            "The only way to do great work is to love what you do. – Steve Jobs",
            "Success is not the key to happiness. Happiness is the key to success.",
            "Believe you can and you're halfway there. – Theodore Roosevelt",
            "You miss 100% of the shots you don't take. – Wayne Gretzky",
            "The best time to plant a tree was 20 years ago. The second best time is now.",
        ];
    });

function typeQuote(quote, element, delay = 60, onComplete) {
    element.textContent = '';
    element.style.display = 'block';
    const words = quote.split(' ');
    let i = 0;
    function typeNext() {
        if (i < words.length) {
            element.textContent += (i === 0 ? '' : ' ') + words[i];
            i++;
            setTimeout(typeNext, delay + Math.random() * 80);
        } else if (onComplete) {
            onComplete();
        }
    }
    typeNext();
}

window.onload = function() {
    const quoteElement = document.getElementById('quote');
    const btn = document.getElementById('generate-btn');
    const shareBtn = document.getElementById('linkedin-share');
    const imgblock = document.getElementById('quote-img');
    if (btn) {
        btn.onclick = function() {
            btn.classList.add('hide');
            setTimeout(() => { btn.style.display = 'none'; }, 400);
            quoteElement.style.display = 'block';
            const randomIndex = Math.floor(Math.random() * quotes.length);
            console.info(`Selected quote index: ${randomIndex}`);
            const quoteText = quotes[randomIndex].Joke || quotes[randomIndex];

            typeQuote(quoteText, quoteElement, 60, function() {
                    paintArt(art=quotes[randomIndex].ascii_art,imgblock).then(() => {                    
                        if (shareBtn) {
                            const shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href) +
                                '&summary=' + encodeURIComponent(quoteText);
                            shareBtn.href = shareUrl;
                            shareBtn.style.display = 'inline-block';
                            shareBtn.style.opacity = '1';
                        }
                    });
            });
        };
    }
    if (shareBtn) {
        shareBtn.style.display = 'none';
        shareBtn.style.opacity = '0';
    }
    quoteElement.style.display = 'none';
};

function paintArt(art, imgblock) {
    return fetch(art)
        .then(response => response.text())
        .then(html => {
            return new Promise((resolve) => {
                if (!imgblock) {
                    console.error('Image block not found');
                    return resolve();
                }
                if (!html) {
                    console.error('No ASCII art found');
                    imgblock.style.display = 'none';
                    return resolve();
                }
                imgblock.style.display = 'inline-block';
                imgblock.innerHTML = "";
                const lines = html.split("<br />");
                let i = 0;
                let completed = 0;
                console.info(lines.length);
                
                lines.forEach((line, index) => {
                    i += 1;
                    setTimeout(() => {
                        imgblock.innerHTML += line + '<br />';
                        completed++;
                        if (completed === lines.length) {
                            resolve();
                        }
                    }, i);
                });
            });
        })
        .catch(error => {
            console.error('Error loading ASCII art:', error);
            imgblock.style.display = 'none';
            return Promise.reject(error);
        });
}

