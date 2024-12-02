function compareCode() {
    const code1 = document.getElementById('code1').value;
    const code2 = document.getElementById('code2').value;
    const result = document.getElementById('result');
    result.innerHTML = ''; // Clear previous results

    // Extract blocks
    const blocks1 = extractCodeBlocks(code1);
    const blocks2 = extractCodeBlocks(code2);

    // Find unique blocks
    const uniqueToCode1 = blocks1.filter(block => !blocks2.includes(block));
    const uniqueToCode2 = blocks2.filter(block => !blocks1.includes(block));

    if (uniqueToCode1.length === 0 && uniqueToCode2.length === 0) {
        result.innerHTML = '<div>No differences found!</div>';
        return;
    }

    // Combine all unique blocks for Code 1 into a single block
    if (uniqueToCode1.length > 0) {
        const code1Content = uniqueToCode1.join('\n\n');
        result.innerHTML += createBlock(code1Content, 'Blocks Unique to Code 1', 'green', 'Code 1');
    }

    // Combine all unique blocks for Code 2 into a single block
    if (uniqueToCode2.length > 0) {
        const code2Content = uniqueToCode2.join('\n\n');
        result.innerHTML += createBlock(code2Content, 'Blocks Unique to Code 2', 'blue', 'Code 2');
    }
}

// Helper to create a styled block with a copy button
function createBlock(content, title, color, label) {
    const blockId = `${label}-${content.hashCode()}`;
    return `
        <div style="margin-bottom: 20px;">
            <strong style="color: ${color};">${title}:</strong>
            <pre style="background: #f8f9fa; border: 1px solid #ddd; padding: 10px; white-space: pre-wrap;" id="${blockId}">
${content}
            </pre>
            <button onclick="copyBlock('${blockId}')">Copy ${label} Block</button>
        </div>`;
}

function extractCodeBlocks(code) {
    const blocks = [];
    let currentBlock = [];
    let openBraces = 0;

    code.split('\n').forEach(line => {
        if (line.trim()) {
            currentBlock.push(line);
            if (line.includes('{')) openBraces++;
            if (line.includes('}')) openBraces--;

            if (openBraces === 0 && currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
                currentBlock = [];
            }
        }
    });

    return blocks.map(block => block.trim());
}

function copyBlock(blockId) {
    const block = document.getElementById(blockId);
    const textToCopy = block.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Block copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy block: ' + err);
    });
}

// Helper: Generate a hash code for unique IDs
String.prototype.hashCode = function () {
    let hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
