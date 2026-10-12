import { findByProps } from "@vendetta/metro";
import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";

const { FormSwitchRow, FormSection } = Forms;
const UserStore = findByProps("getCurrentUser");
const Badges = findByProps("getBadges") || findByProps("addProfileBadge");

// Official Discord badge icons
const BADGES = [
  {
    key: "earlySupporter",
    name: "Early Supporter",
    image: "https://cdn.discordapp.com/badge-icons/7060786766c9c840eb3019e725d2b358.png",
    description: "Early Supporter"
  },
  {
    key: "partner",
    name: "Partnered Server Owner",
    image: "https://cdn.discordapp.com/badge-icons/3f9748e53446a137a052f3454e2de41e.png",
    description: "Partnered Server Owner"
  },
  {
    key: "activeDeveloper",
    name: "Active Developer",
    image: "https://cdn.discordapp.com/badge-icons/6bdc42827a38498929a4920da12695d9.png",
    description: "Active Developer"
  },
  {
    key: "earlyVerifiedDev",
    name: "Early Verified Bot Developer",
    image: "https://cdn.discordapp.com/badge-icons/6df5892e0f35b051f8b61eace34f4967.png",
    description: "Early Verified Bot Developer"
  },
  {
    key: "bugHunter",
    name: "Bug Hunter",
    image: "https://cdn.discordapp.com/badge-icons/2717692c7dca7289b35297368a940dd0.png",
    description: "Discord Bug Hunter"
  },
  {
    key: "bugHunterGold",
    name: "Bug Hunter Gold",
    image: "https://cdn.discordapp.com/badge-icons/848f79194d4be5ff5f81505cbd0ce1e6.png",
    description: "Discord Bug Hunter"
  },
  {
    key: "modAlumni",
    name: "Moderator Programs Alumni",
    image: "https://cdn.discordapp.com/badge-icons/fee1624003e2fee35cb398e125dc479b.png",
    description: "Moderator Programs Alumni"
  },
  {
    key: "staff",
    name: "Discord Staff",
    image: "https://cdn.discordapp.com/badge-icons/5e74e9b61934fc1f67c65515d1f7e60d.png",
    description: "Discord Staff"
  }
];

// Default all to off
if (!storage.badges) {
  storage.badges = {};
  BADGES.forEach(b => storage.badges[b.key] = false);
}

function isMe(userId) {
  const me = UserStore.getCurrentUser();
  return me && me.id === userId;
}

const applied = [];

function applyBadges() {
  // Clear previous
  applied.forEach(b => {
    try { Badges.removeProfileBadge?.(b); } catch {}
  });
  applied.length = 0;

  BADGES.forEach(badge => {
    if (!storage.badges[badge.key]) return;

    const badgeObj = {
      id: `csb_${badge.key}`,
      description: badge.description,
      image: badge.image,
      shouldShow: ({ userId }) => isMe(userId)
    };

    try {
      Badges.addProfileBadge?.(badgeObj);
      applied.push(badgeObj);
    } catch (e) {
      console.log("[ClientSideBadges] Failed to add", badge.name, e);
    }
  });
}

export default {
  onLoad() {
    applyBadges();
  },
  onUnload() {
    applied.forEach(b => {
      try { Badges.removeProfileBadge?.(b); } catch {}
    });
  },
  settings: () => {
    return React.createElement(FormSection, { title: "Client Side Badges" },
      BADGES.map(badge =>
        React.createElement(FormSwitchRow, {
          key: badge.key,
          label: badge.name,
          value: !!storage.badges[badge.key],
          onValueChange: (v) => {
            storage.badges[badge.key] = v;
            applyBadges();
          }
        })
      )
    );
  }
};
