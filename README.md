# Titanium Vault

**Titanium Vault** is a premium, secure, and advanced password generator built with React and Vite. It features a stunning glassmorphic UI, real-time strength estimation, and flexible configuration options to generate highly secure passwords tailored to your needs.

## Features

- **Customizable Length**: Generate passwords from 8 up to 64 characters.
- **Character Sets**: Toggle Uppercase, Lowercase, Numbers, and Symbols.
- **Complexity Modes**:
    - **Standard**: Uses all selected character sets.
    - **Easy to Read**: Excludes ambiguous characters (e.g., `l`, `1`, `I`, `O`, `0`).
    - **Easy to Say**: Excludes numbers and symbols for memorable passwords.
- **Custom Keywords**: Insert a specific keyword into the generated password at a random position.
- **Real-time Strength Meter**: Visual indicator and text assessment (Very Weak to Strong).
- **One-Click Copy**: Easily copy generated passwords to your clipboard.
- **Modern UI**: Polished Glassmorphism design with smooth animations and transitions.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: Material Symbols Outlined

## Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/titanium-vault.git
   cd titanium-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── PasswordGenerator.jsx  # Main application logic
│   └── StrengthMeter.jsx      # Password strength visualization
├── App.jsx                    # Root layout and background effects
├── index.css                  # Global styles and Tailwind imports
└── main.jsx                   # Entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
