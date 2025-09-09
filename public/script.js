document.addEventListener('DOMContentLoaded', () => {
 const sentenceInput = document.getElementById('sentenceInput');
 const analyzeButton = document.getElementById('analyzeButton');
 const resultContainer = document.getElementById('resultContainer');
 const loadingMessage = document.getElementById('loadingMessage');
 const errorMessage = document.getElementById('errorMessage');

 // Tooltip elem létrehozása
 const tooltip = document.createElement('div');
 tooltip.className = 'custom-tooltip hidden';
 document.body.appendChild(tooltip);

 analyzeButton.addEventListener('click', async () => {
     const sentence = sentenceInput.value.trim();

     if (!sentence) {
         errorMessage.textContent = 'Kérlek, írj be egy mondatot az elemzéshez.';
         errorMessage.classList.remove('hidden');
         resultContainer.innerHTML = '';
         return;
     }

     errorMessage.classList.add('hidden');
     resultContainer.innerHTML = '';
     loadingMessage.classList.remove('hidden');

     try {
         const response = await fetch('/analyze', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ sentence }),
         });

         if (!response.ok) {
             throw new Error('Hiba történt a szerver oldalon.');
         }

         const data = await response.json();

         data.forEach(item => {
             const span = document.createElement('span');
             const posClass = `pos-${item.pos.toLowerCase()}`;
             span.classList.add('word', posClass);
             span.textContent = item.word;

             // Tooltip események
             if (item.tags && item.tags.length > 0) {
                 span.addEventListener('mouseenter', (e) => {
                     tooltip.textContent = `Tags: ${item.tags.join(', ')}`;
                     tooltip.classList.remove('hidden');
                     const rect = e.target.getBoundingClientRect();
                     tooltip.style.left = `${rect.left + window.scrollX}px`;
                     tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 8}px`;
                 });
                 span.addEventListener('mouseleave', () => {
                     tooltip.classList.add('hidden');
                 });
             }

             resultContainer.appendChild(span);
             resultContainer.appendChild(document.createTextNode(' '));
         });

     } catch (error) {
         errorMessage.textContent = `Hiba történt: ${error.message}`;
         errorMessage.classList.remove('hidden');
     } finally {
         loadingMessage.classList.add('hidden');
     }
 });
});