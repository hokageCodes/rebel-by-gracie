import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['home', 'about', 'contact', 'privacy', 'terms'],
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  meta: {
    description: String,
    keywords: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
  },
  sections: {
    hero: {
      leftImage: {
        url: String,
        alt: String,
        link: String,
      },
      centerContent: {
        title: String,
        subtitle: String,
        description: String,
        ctaText: String,
        ctaLink: String,
        ctaStyle: {
          type: String,
          enum: ['primary', 'secondary', 'outline'],
          default: 'primary',
        },
      },
      rightImage: {
        url: String,
        alt: String,
        link: String,
      },
      background: {
        type: {
          type: String,
          enum: ['gradient', 'solid', 'image'],
          default: 'gradient',
        },
      },
      backgroundColor: String,
      backgroundImage: String,
    },
    newRelease: {
      title: String,
      subtitle: String,
      ctaText: String,
      ctaLink: String,
      products: [{
        id: String,
        name: String,
        image: {
          url: String,
          alt: String,
        },
        price: Number,
        link: String,
        isCustomLink: {
          type: Boolean,
          default: false,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      }],
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    featured: {
      title: String,
      subtitle: String,
      description: String,
      productId: String,
      backgroundImage: {
        url: String,
        alt: String,
      },
      ctaText: String,
      ctaLink: String,
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    other: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update lastModified on save
contentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Create indexes
contentSchema.index({ isActive: 1 });

const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

export default Content;
