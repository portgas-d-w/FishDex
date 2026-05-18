export const REACTION_EMOJIS = [
  { key: 'respect',  emoji: '🙏', label: 'Respect'  },
  { key: 'beau',     emoji: '😍', label: 'Beau'     },
  { key: 'merci',    emoji: '🙌', label: 'Merci'    },
  { key: 'inspire',  emoji: '✨', label: 'Inspiré'  },
  { key: 'sage',     emoji: '🧘', label: 'Sage'     },
  { key: 'sourire',  emoji: '😊', label: 'Sourire'  },
  { key: 'force',    emoji: '💪', label: 'Force'    },
] as const

export type ReactionKey = typeof REACTION_EMOJIS[number]['key']
