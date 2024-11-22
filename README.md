# Leakcheck - Raycast Extension

**Leakcheck** is a Raycast extension that allows you to query the LeakCheck API to search for data breaches associated with email addresses.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) ![GitHub last commit](https://img.shields.io/github/last-commit/ahmosys/leakcheck-raycast) ![GitHub issues](https://img.shields.io/github/issues/ahmosys/leakcheck-raycast)


![Leakcheck](https://cdn.discordapp.com/attachments/753686165311193099/1309617387452235858/CleanShot_2024-11-22_at_21.31.02.png?ex=67423bbc&is=6740ea3c&hm=adb1ed0d0251c90d1a99095fde2ba1be09e96516aeb57052ab83ef153bd9215f&)


## 📋 Description

Leakcheck provides a fast and efficient way to check if an email address has been involved in data breaches. This extension is perfect for security professionals and users concerned about the privacy of their information.

## 🚀 Features

- 🔍 **Data Breach Lookup**: Enter an email address to query the LeakCheck API for associated breaches.
- 🔐 **Secure API Key Management**: Store your LeakCheck API key privately and securely through Raycast preferences.
- 🎯 **Seamless Raycast Integration**: Use this extension directly from the Raycast interface.

## 🛠️ Installation

1. **Install Raycast**: [Download here](https://www.raycast.com/).
2. **Install the Leakcheck extension**:
   - Clone this repository or download it directly.
   - Run the following command in the project directory to enable the extension:
     ```bash
     npm install && npm run dev
     ```
   - Publish or load the extension into your Raycast instance.

## ⚙️ Configuration

Before using the extension, configure your LeakCheck API key:

1. Open Raycast.
2. Go to the **extension preferences**.
3. Add your LeakCheck API key in the designated field.
   - If you don’t have an API key, sign up at [leakcheck.io](https://leakcheck.io) to get one.

## 📖 Usage

1. Open Raycast and search for **Lookup Data Breach**.
2. Enter an email address into the provided field.
3. The extension will query the LeakCheck API and return any data breach results, if available.

## 🧩 Dependencies

- [Raycast API](https://github.com/raycast/extensions)
- [Raycast Utils](https://github.com/raycast/extensions)

## 🛠️ Scripts

- `npm run build`: Build the extension.
- `npm run dev`: Run the extension in development mode.
- `npm run lint`: Check for code issues.
- `npm run fix-lint`: Automatically fix linting issues.

## 🚧 Development

To contribute to development or customize the extension for your needs:

1. Clone the repository:
   ```bash
   git clone <REPOSITORY_URL>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the extension in development mode:
   ```bash
    npm run dev
   ```

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## 🤝 Credits

Built with ❤️ by [Ahmosys](https://github.com/ahmosys).
<br/>
Extension designed to simplify data breach searches directly from Raycast.
