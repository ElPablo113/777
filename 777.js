const SYMBOLS_COUNT = { "A": 2, "B": 4, "C": 6, "D": 8 };
const SYMBOL_VALUES = { "A": 5, "B": 4, "C": 3, "D": 2 };

let balance = 0;

const updateBalance = () => {
    document.getElementById("balance").textContent = balance;
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) symbols.push(symbol);
    }

    // Ensure higher chances of a win by favoring aligned rows
    const reels = [];
    const commonSymbol = symbols[Math.floor(Math.random() * symbols.length)]; // Common symbol for better winning chances

    for (let i = 0; i < 3; i++) {
        const reelSymbols = [...symbols];
        reels.push([]);

        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.random() < 0.4 ? symbols.indexOf(commonSymbol) : Math.floor(Math.random() * reelSymbols.length);
            reels[i].push(reelSymbols[randomIndex]);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < 3; i++) {
        rows.push([]);
        for (let j = 0; j < 3; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let i = 0; i < lines; i++) {
        const symbols = rows[i];
        if (symbols.every((symbol) => symbol === symbols[0])) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};

const startSpinningAnimation = () => {
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3"),
    ];

    const symbols = Object.keys(SYMBOLS_COUNT);

    const intervalIds = [];

    slots.forEach((slot, index) => {
        const intervalId = setInterval(() => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            slot.textContent = randomSymbol;
        }, 100); // Update symbol every 100ms
        intervalIds.push(intervalId);
    });

    return intervalIds;
};

const stopSpinningAnimation = (intervalIds, rows) => {
    const slots = [
        document.getElementById("slot1"),
        document.getElementById("slot2"),
        document.getElementById("slot3"),
    ];

    intervalIds.forEach((id, index) => {
        clearInterval(id); // Stop the animation
        slots[index].textContent = rows[0][index]; // Set the final symbol
    });
};

document.getElementById("deposit-btn").addEventListener("click", () => {
    const depositAmount = parseFloat(document.getElementById("deposit").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        document.getElementById("message").textContent = "Invalid deposit amount!";
        return;
    }
    balance += depositAmount;
    updateBalance();
    document.getElementById("message").textContent = "";
    document.getElementById("spin-btn").disabled = false;
});

document.getElementById("spin-btn").addEventListener("click", () => {
    const lines = parseInt(document.getElementById("lines").value);
    const bet = parseFloat(document.getElementById("bet").value);

    if (isNaN(lines) || lines <= 0 || lines > 3) {
        document.getElementById("message").textContent = "Invalid number of lines!";
        return;
    }
    if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
        document.getElementById("message").textContent = "Invalid bet amount!";
        return;
    }

    balance -= bet * lines;
    updateBalance();

    const reels = spin();
    const rows = transpose(reels);

    const intervalIds = startSpinningAnimation();

    setTimeout(() => {
        stopSpinningAnimation(intervalIds, rows);

        const winnings = getWinnings(rows, bet, lines);
        balance += winnings;
        updateBalance();

        document.getElementById("winnings").textContent = winnings;
        document.getElementById("message").textContent = winnings
            ? "🎉 Congratulations! You won!"
            : "😢 Better luck next time!";
    }, 2000); // Spin for 2 seconds before stopping
});