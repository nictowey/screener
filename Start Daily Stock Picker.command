#!/bin/bash
# ============================================================
#  Daily Stock Picker — One-Click Mac Launcher
#  Double-click this file in Finder to set up and run the app.
# ============================================================

set -e

# ---- colours for terminal output ----
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # no colour

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Daily Stock Picker — Setup & Launch  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ---- 1. Homebrew ----
if ! command -v brew &>/dev/null; then
  echo -e "${YELLOW}Installing Homebrew (Mac package manager)...${NC}"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # Make brew available in this session (Apple Silicon vs Intel paths)
  if [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [ -f /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
else
  echo -e "${GREEN}✓ Homebrew already installed${NC}"
fi

# ---- 2. Node.js ----
if ! command -v node &>/dev/null; then
  echo -e "${YELLOW}Installing Node.js...${NC}"
  brew install node
else
  echo -e "${GREEN}✓ Node.js already installed ($(node -v))${NC}"
fi

# ---- 3. pnpm ----
if ! command -v pnpm &>/dev/null; then
  echo -e "${YELLOW}Installing pnpm...${NC}"
  npm install -g pnpm
else
  echo -e "${GREEN}✓ pnpm already installed ($(pnpm -v))${NC}"
fi

# ---- 4. Install project dependencies ----
echo ""
echo -e "${YELLOW}Installing project dependencies...${NC}"
pnpm install

# ---- 5. Build the app ----
echo ""
echo -e "${YELLOW}Building the app...${NC}"
pnpm build

# ---- 6. Start the server & open the browser ----
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Launching Daily Stock Picker...      ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "The app will open at ${BLUE}http://localhost:3000${NC}"
echo -e "Press ${YELLOW}Ctrl+C${NC} to stop the server."
echo ""

# Give the server a moment to start, then open Safari/Chrome
(sleep 3 && open "http://localhost:3000") &

pnpm start
