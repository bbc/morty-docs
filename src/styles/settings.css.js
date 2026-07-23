module.exports = `.settings-container {
    position: relative;
    margin-left: auto;
}

.settings-button {
    background: transparent;
    border: none;
    color: var(--text-header);
    cursor: pointer;
    padding: 1rem;
    font-size: 1rem;
}

.settings-button .settings-text {
    display: inline;
}

.settings-button .settings-icon {
    display: none;
}

.settings-button:hover {
    opacity: 0.8;
}

@media (max-width: 768px) {
    .settings-button .settings-text {
        display: none;
    }

    .settings-button .settings-icon {
        display: inline;
    }
}

.settings-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 1px;
    background: var(--bg-primary);
    border: 1px solid var(--border-colour);
    min-width: 150px;
    display: none;
    z-index: 1000;
}

.settings-dropdown.open {
    display: block;
}

.theme-option {
    width: 90%;
    background: transparent;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 10px 12px;
    margin: 8px 5%;
    text-align: left;
    font-size: 0.95rem;
    display: block;
}

.theme-option:hover {
    background: var(--bg-secondary);
}

.theme-option.active {
    background: var(--bg-secondary);
}

@media (max-width: 768px) {
    .settings-dropdown {
        right: 0;
    }
}`
