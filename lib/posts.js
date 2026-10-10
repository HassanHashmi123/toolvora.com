// Guides. The long ones live in lib/guides.js; the ones below get extra sections from lib/guidesMore.js.
// Built and maintained by Vibeans Solutions.
import { guides } from './guides';
import { added } from './guidesMore';

const shorter = [
  {
    "slug": "how-to-create-permanent-qr-codes",
    "title": "How to Create Permanent QR Codes for Any Link",
    "desc": "Generate clean, static QR codes that never expire for restaurant menus, business cards, marketing flyers, and direct website links.",
    "date": "2026-10-04",
    "tool": "qr-code-generator",
    "content": [
      {
        "p": "QR codes have become an essential link between the physical world and digital experiences. From contactless restaurant menus to business cards and packaging labels, a quick camera scan connects users to websites in under a second."
      },
      {
        "h": "Why static QR codes never expire"
      },
      {
        "p": "Many commercial QR code generators create redirect links that stop working once a monthly subscription lapses. Static QR codes encode the destination URL directly into the black and white pixel matrix itself. Because there is no intermediary server, a static QR code works forever."
      },
      {
        "h": "How to generate a QR code"
      },
      {
        "ol": [
          "Type or paste your complete destination URL or contact text into the input field.",
          "Press Generate QR Code to produce the matrix pattern.",
          "Download the PNG image to your device.",
          "Embed the image in your flyer, poster, or business card layout."
        ]
      },
      {
        "h": "Best practices for physical printing"
      },
      {
        "ul": [
          "Always test the QR code with multiple smartphone cameras before printing large batches.",
          "Maintain high contrast between the foreground code and background surface (black on white is most reliable).",
          "Leave a clear quiet zone (white margin) around the outside edges of the code matrix.",
          "Ensure the printed code measures at least 2 centimeters by 2 centimeters for comfortable scanning."
        ]
      },
      {
        "p": "The DocBrio generator makes static codes of this kind, with no account and no limit on how many you create."
      }
    ]
  },
  {
    "slug": "how-to-count-words-and-reading-time",
    "title": "How to Track Word Count, Character Limits and Reading Time",
    "desc": "Monitor real time word counts, character caps, sentence metrics, and estimated speech or reading duration for essays and articles.",
    "date": "2026-10-04",
    "tool": "word-counter",
    "content": [
      {
        "p": "Whether preparing a college application essay with a strict 500 word limit, drafting a social media post, or timing a keynote presentation speech, tracking precise text length is essential for effective communication."
      },
      {
        "h": "Key metrics that matter"
      },
      {
        "ul": [
          "Word Count: Essential for academic papers, magazine articles, and freelance writing contracts.",
          "Character Count: Critical for social media platforms, meta descriptions, and character constrained forms.",
          "Sentence and Paragraph Counts: Helps identify run on thoughts and improve readability scores.",
          "Reading Time: Calculated based on the average adult silent reading pace of 200 to 250 words per minute.",
          "Speaking Time: Estimated at roughly 130 to 150 words per minute for natural speech delivery."
        ]
      },
      {
        "h": "Using the live counter tool"
      },
      {
        "ol": [
          "Paste or compose your text directly into the Word Counter workspace.",
          "Review the instant statistics updating dynamically with every keystroke.",
          "Trim or expand your copy until you hit your exact target threshold.",
          "Copy the refined text back to your manuscript or publishing platform."
        ]
      },
      {
        "p": "The counter runs in your browser and also works with Urdu text. Your writing is not sent anywhere or stored."
      }
    ]
  },
  {
    "slug": "how-to-convert-text-case-instantly",
    "title": "How to Switch Text Between Upper, Lower, Title and Sentence Case",
    "desc": "Instantly fix accidental Caps Lock text, format headlines in proper Title Case, and normalize sentences with one click formatting.",
    "date": "2026-10-05",
    "tool": "case-converter",
    "content": [
      {
        "p": "Everyone has accidentally typed an entire paragraph only to glance up and discover Caps Lock was turned on. Manually retyping all that text is frustrating and unnecessary. A smart case converter reorganizes capitalizations in milliseconds."
      },
      {
        "h": "Common text case conventions"
      },
      {
        "ul": [
          "Sentence case: Capitalizes the very first letter of each sentence while leaving remaining words lowercase.",
          "UPPERCASE: Capitalizes every single letter, ideal for legal warnings and acronyms.",
          "lowercase: Converts all characters to small letters, useful for programming variables and email normalization.",
          "Title Case: Capitalizes the initial letter of major words, adhering to publishing and headline standards."
        ]
      },
      {
        "h": "How to use the case converter"
      },
      {
        "ol": [
          "Paste your raw text into the input box.",
          "Select your desired case format button.",
          "Review the instantly transformed text in the output box.",
          "Click Copy to clipboard to paste the clean copy into your document."
        ]
      },
      {
        "p": "The converter works in your browser, and your text is not sent anywhere."
      }
    ]
  },
  {
    "slug": "how-to-convert-powerpoint-to-pdf",
    "title": "How to Convert PowerPoint Slides to Sharable PDF Handouts",
    "desc": "Transform PPTX presentations into universal PDF slide decks that open smoothly on every device without requiring Microsoft Office.",
    "date": "2026-10-06",
    "tool": "powerpoint-to-pdf",
    "content": [
      {
        "p": "Delivering or emailing a PowerPoint presentation can lead to unexpected formatting problems when the recipient does not have the exact same version of Microsoft Office or lacks custom slide fonts. Converting the presentation to a PDF avoids that, because a PDF looks the same on every device."
      },
      {
        "h": "Benefits of PDF presentations"
      },
      {
        "ul": [
          "A fixed layout: a PDF page looks the same on every device, whatever software the reader has.",
          "Universal compatibility: Opens effortlessly on mobile phones, tablets, and desktop computers without specialized apps.",
          "Print readiness: PDF slides are naturally formatted for physical distribution as student or audience handouts.",
          "Security: Prevents audience members from accidentally altering your slide data or notes."
        ]
      },
      {
        "h": "Step by step conversion instructions"
      },
      {
        "ol": [
          "Select your PowerPoint presentation (.pptx format).",
          "Drop the file into the PowerPoint to PDF converter.",
          "Wait a moment while each slide is drawn onto its own PDF page.",
          "Download your completed PDF presentation."
        ]
      },
      {
        "p": "The conversion runs in your browser, so the presentation is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-turn-pdf-into-powerpoint-slides",
    "title": "How to Turn PDF Documents into Presentation Slide Decks",
    "desc": "Turn the pages of a PDF report or handout into PowerPoint slides that you can annotate and present.",
    "date": "2026-10-06",
    "tool": "pdf-to-powerpoint",
    "content": [
      {
        "p": "When clients share quarterly reports, whitepapers, or infographics exclusively as PDF files, building an executive summary presentation from scratch can be challenging. Converting the PDF directly into PowerPoint slides saves considerable preparation time."
      },
      {
        "h": "How the transformation works"
      },
      {
        "p": "The PDF to PowerPoint converter reads every page of your document and constructs a matching slide canvas in a fresh .pptx workbook. Each page is mapped onto a clean slide backdrop, allowing you to layer text boxes, highlight arrows, and presentation bullet points over the original material."
      },
      {
        "h": "How to convert your PDF into slides"
      },
      {
        "ol": [
          "Select the PDF document you want to turn into a slide presentation.",
          "Press Convert to PowerPoint in your browser.",
          "Download the generated .pptx slide deck.",
          "Open the file in PowerPoint, Google Slides, or Apple Keynote to add speaker notes and commentary."
        ]
      },
      {
        "h": "Enhancing converted slides"
      },
      {
        "ul": [
          "Add clean headline boxes above charts to provide executive context.",
          "Draw subtle highlighting rectangles around key metrics and revenue numbers.",
          "Incorporate transition effects to guide audience focus during live presentations."
        ]
      },
      {
        "p": "Because the conversion runs in your browser, the document is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-edit-and-whiteout-pdf-pages",
    "title": "How to Edit PDF Text, Draw Annotations and Whiteout Mistakes",
    "desc": "Fill in forms, cover small mistakes with whiteout and draw on PDF pages in your browser, and learn why whiteout is not redaction.",
    "date": "2026-10-06",
    "tool": "edit-pdf",
    "content": [
      {
        "p": "Need to fill in a PDF form that has no fillable fields, add a date, or cover a small typing mistake? You do not need an expensive PDF editing subscription to make quick changes."
      },
      {
        "h": "Key editing capabilities"
      },
      {
        "ul": [
          "Text Insertion: Click anywhere on a page to insert custom typography, fill out form lines, or add dates.",
          "Whiteout: Draw white rectangles over mistakes or outdated details. This covers them visually and does not delete what is underneath.",
          "Freehand Annotation: Draw sketches, checkmarks, arrows, and corrections using your mouse or touchscreen stylus."
        ]
      },
      {
        "h": "How to edit your PDF online"
      },
      {
        "ol": [
          "Upload your PDF to the Edit PDF canvas.",
          "Choose Text, Whiteout, or Draw from the top toolbar.",
          "Click or drag on the page to apply your modifications.",
          "Click Save PDF to download your updated document."
        ]
      },
      {
        "p": "Editing takes place in your browser, and the document is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-crop-pdf-pages-and-margins",
    "title": "How to Crop PDF Pages and Trim Unwanted Margins Free",
    "desc": "Cut away excess white borders, isolate specific tables or diagrams, and optimize PDF documents for comfortable mobile reading.",
    "date": "2026-10-06",
    "tool": "crop-pdf",
    "content": [
      {
        "p": "Many PDF documents, especially academic papers and scanned book chapters, feature wide blank margins that make reading on mobile phones or digital book readers uncomfortable. Cropping trims these margins to maximize readable screen area."
      },
      {
        "h": "When cropping PDFs is valuable"
      },
      {
        "ul": [
          "Trimming excess white margins for improved reading on tablets and digital book readers.",
          "Extracting a single diagram, table, or concert ticket from an entire page.",
          "Removing unwanted scanner edges, dark punch hole borders, and header lines.",
          "Formatting document pages uniformly for clean booklet printing."
        ]
      },
      {
        "h": "How to crop your PDF pages"
      },
      {
        "ol": [
          "Open the Crop PDF tool and load your document.",
          "Drag a crop box over the specific area of the page you wish to retain.",
          "Choose whether to apply the crop boundary to just the current page or across all pages.",
          "Click Crop PDF and download the trimmed result."
        ]
      },
      {
        "p": "Text inside the cropped area stays sharp and selectable, because the page is not turned into a picture."
      }
    ]
  },
  {
    "slug": "how-to-convert-ico-to-png",
    "title": "How to Convert Website Favicon ICO Files into Clean PNG Graphics",
    "desc": "Get the largest picture out of a Windows icon or website favicon file as a PNG with its transparency intact.",
    "date": "2026-10-06",
    "tool": "ico-to-png",
    "content": [
      {
        "p": "The .ico format is a specialized container historically used for website favicons and Windows desktop icons. Most modern photo viewers, mobile operating systems, and web apps cannot open ICO files directly, making conversion necessary."
      },
      {
        "h": "Why ICO files are unique"
      },
      {
        "p": "An ICO file frequently contains multiple distinct resolutions of the same graphic bundled together, ranging from tiny 16x16 pixel icons up to crisp 256x256 pixel assets. Our converter extracts the largest, highest quality asset and saves it as a clean PNG."
      },
      {
        "h": "Step by step conversion"
      },
      {
        "ol": [
          "Select your .ico file.",
          "Drop it into the ICO to PNG tool.",
          "Press Convert to PNG.",
          "Download the resulting PNG image with full transparency preserved."
        ]
      },
      {
        "p": "The converted PNG can be freely edited in Photoshop, Figma, Canva, or used across presentations and marketing decks."
      }
    ]
  },
  {
    "slug": "how-to-create-favicon-ico-from-png",
    "title": "How to Create Multi Resolution Website Favicons from PNG Logos",
    "desc": "Generate professional multi size favicon.ico files containing 16px, 32px, 48px and 256px layers to ensure crisp browser tab branding.",
    "date": "2026-10-06",
    "tool": "png-to-ico",
    "content": [
      {
        "p": "While modern web browsers support PNG and SVG favicons, having an authentic multi size favicon.ico in your website root remains crucial for complete backward compatibility across older browsers, bookmarks, and desktop shortcuts."
      },
      {
        "h": "Why multi resolution icons matter"
      },
      {
        "p": "A single standard image scaled down by the browser can look blurry. A proper ICO file bundles distinct resolutions: 16x16 for browser tabs, 32x32 for bookmarks, and up to 256x256 for high density displays, allowing the browser to select the ideal scale."
      },
      {
        "h": "How to create your favicon"
      },
      {
        "ol": [
          "Choose a clean, square PNG logo or graphic.",
          "Upload the file to the PNG to ICO converter.",
          "Click Convert to generate the multi layer ICO container.",
          "Download the file as favicon.ico and upload it to your website root folder."
        ]
      },
      {
        "p": "For maximum visual clarity, use a simple, bold mark with high contrast that remains instantly recognizable even at tiny dimensions."
      }
    ]
  },
  {
    "slug": "how-to-convert-png-to-webp-for-speed",
    "title": "How to Convert PNG to WebP to Accelerate Website Page Speed",
    "desc": "Make PNG graphics lighter for a website by converting them to WebP, and measure whether it really helped.",
    "date": "2026-10-06",
    "tool": "png-to-webp",
    "content": [
      {
        "p": "Heavy PNG images are a common reason for slow web pages. Lighter images make pages load faster, most noticeably for visitors on mobile data."
      },
      {
        "h": "The power of WebP compression"
      },
      {
        "p": "WebP provides both lossy and lossless compression specifically engineered for the modern internet. Converting PNG graphics to WebP usually makes them clearly smaller while keeping transparent backgrounds. How much smaller depends on the picture."
      },
      {
        "h": "How to convert PNG to WebP"
      },
      {
        "ol": [
          "Select your PNG graphics or banners.",
          "Adjust the quality slider to your desired balance (80 to 90 percent is great for graphics).",
          "Click Convert to WebP.",
          "Download the WebP files."
        ]
      },
      {
        "p": "All major modern browsers (Chrome, Safari, Firefox, Edge) natively display WebP images without requiring special plugins."
      }
    ]
  },
  {
    "slug": "how-to-convert-avif-to-png",
    "title": "How to Open and Convert Unreadable AVIF Images into PNG",
    "desc": "Turn an AVIF picture that will not open into a PNG that editors and office programs accept.",
    "date": "2026-10-06",
    "tool": "avif-to-png",
    "content": [
      {
        "p": "AVIF is a next generation image format derived from the AV1 video codec. While it compresses very well, many desktop apps, graphic suites, and email tools cannot open or preview AVIF files yet."
      },
      {
        "h": "Fixing the cannot open file error"
      },
      {
        "p": "When you download a graphic from a modern website and your computer shows an unrecognizable file icon, converting the image to PNG solves it. PNG has been supported by practically all image software for decades."
      },
      {
        "h": "Converting AVIF to PNG in seconds"
      },
      {
        "ol": [
          "Select your .avif files.",
          "Drop them into the AVIF to PNG converter.",
          "Press Convert to PNG.",
          "Download your fully decoded, transparent PNG graphics."
        ]
      },
      {
        "p": "The conversion runs in your browser, so the picture is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-convert-png-to-avif",
    "title": "How to Convert PNG to AVIF for Smaller Web Images",
    "desc": "How to test AVIF on one important image, serve it with a fallback and avoid the usual mistakes.",
    "date": "2026-10-06",
    "tool": "png-to-avif",
    "content": [
      {
        "p": "AVIF is one of the newest image formats for the web. In published comparisons it often produces smaller files than JPEG and WebP at similar quality, though results vary from picture to picture."
      },
      {
        "h": "Why choose AVIF?"
      },
      {
        "ul": [
          "Strong compression: files are often much smaller than a JPEG or PNG of the same picture.",
          "Full alpha transparency: Retains clean transparent backgrounds for icons and product overlays.",
          "High dynamic range and wide color gamut support for vibrant imagery.",
          "Broad modern browser support across current editions of Chrome, Safari, Firefox, and Edge."
        ]
      },
      {
        "h": "How to convert your images"
      },
      {
        "ol": [
          "Choose your PNG images.",
          "Drop them into the PNG to AVIF converter.",
          "Press Convert and wait. Encoding takes a few seconds per image.",
          "Download the AVIF files."
        ]
      },
      {
        "p": "Smaller images help pages load faster, especially on mobile connections."
      }
    ]
  },
  {
    "slug": "how-to-convert-jpg-to-png",
    "title": "How to Convert JPG Photos to PNG for Editing and Archiving",
    "desc": "When converting a JPG to PNG makes sense, what it cannot do, and a worked example for cutting out a background.",
    "date": "2026-10-06",
    "tool": "jpg-to-png",
    "content": [
      {
        "p": "Every time you edit and save a JPEG photo again, its lossy compression algorithm runs again, causing subtle artifacting and generational degradation. Converting a master JPG to PNG halts this cycle, ensuring subsequent edits remain pristine."
      },
      {
        "h": "When converting JPG to PNG is ideal"
      },
      {
        "ul": [
          "Before executing multiple editing passes in graphic software.",
          "When submitting images to printing portals that strictly mandate PNG uploads.",
          "For archiving master graphic assets that must never lose additional fidelity.",
          "Before cutting out backgrounds to build transparent graphic stickers."
        ]
      },
      {
        "h": "Important note regarding transparency"
      },
      {
        "p": "Converting a JPG to a PNG does not automatically remove the background, because a standard JPG file contains solid pixel data across its entire canvas. Once converted to PNG, you can comfortably use editing tools to erase or mask the background."
      },
      {
        "h": "Step by step conversion"
      },
      {
        "ol": [
          "Select your JPG photos.",
          "Drop them into the JPG to PNG tool.",
          "Click Convert to PNG.",
          "Download your new lossless PNG files."
        ]
      },
      {
        "p": "The conversion runs on your device, and the photo is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-convert-png-to-jpg",
    "title": "How to Convert Bulky PNG Images to Lightweight JPG Files",
    "desc": "Make PNG screenshots small enough for email and upload forms without making the text unreadable.",
    "date": "2026-10-06",
    "tool": "png-to-jpg",
    "content": [
      {
        "p": "Screenshots captured on high resolution retina displays or modern laptops are saved as PNG files that can be several megabytes each. Converting them to JPG usually makes them much smaller."
      },
      {
        "h": "How transparency is handled"
      },
      {
        "p": "The JPEG standard does not support transparent alpha channels. When a PNG with a transparent background is converted into a JPG, transparent pixels are automatically rendered against a clean white backdrop."
      },
      {
        "h": "How to convert PNG to JPG"
      },
      {
        "ol": [
          "Select one or multiple PNG screenshots.",
          "Set the quality slider. At 90 the difference from the original is very hard to see.",
          "Press Convert to JPG.",
          "Download your lightweight images individually or as a single ZIP archive."
        ]
      },
      {
        "p": "Smaller files are quicker to attach, send and upload."
      }
    ]
  },
  {
    "slug": "how-to-convert-jpg-to-ico-favicon",
    "title": "How to Turn a JPG Photo or Logo into a Windows and Browser Icon",
    "desc": "Transform standard JPG photographs and logos into multi resolution ICO icons for website favicons and desktop shortcuts.",
    "date": "2026-10-06",
    "tool": "jpg-to-ico",
    "content": [
      {
        "p": "Looking to turn a favorite photograph into a custom Windows desktop shortcut icon, or format a company badge into a website favicon? The JPG to ICO converter prepares multi size icon containers quickly."
      },
      {
        "h": "Design tips for icon creation"
      },
      {
        "ul": [
          "Start with a square image: Icons are fundamentally square (1:1 aspect ratio). Non square pictures will be centered with empty margins.",
          "Keep visual detail bold: Delicate fine lines and complex typography blur when rendered at 16x16 pixels.",
          "Use high contrast: Distinct color contrasts between the logo and background ensure clarity across both dark and light browser tabs."
        ]
      },
      {
        "h": "How to convert your JPG"
      },
      {
        "ol": [
          "Select your square JPG logo or photo.",
          "Drop the file into the JPG to ICO generator.",
          "Click Convert to ICO to package multi size icon resolutions.",
          "Download your new icon file and apply it to your website or desktop folder."
        ]
      },
      {
        "p": "The icon is made in your browser. The picture is not uploaded and nothing has to be installed."
      }
    ]
  },
  {
    "slug": "how-to-convert-ico-to-jpg",
    "title": "How to Convert ICO Files into Standard JPG Images",
    "desc": "Convert specialized Windows and website favicon ICO files into standard JPG images that open effortlessly across all devices.",
    "date": "2026-10-06",
    "tool": "ico-to-jpg",
    "content": [
      {
        "p": "When you need to embed an icon asset into a PowerPoint presentation, a Word document, or an email signature, many everyday applications reject .ico files. Converting the icon into a standard JPG provides universal compatibility."
      },
      {
        "h": "Resolution and background handling"
      },
      {
        "p": "The converter extracts the largest icon stored inside the ICO container and renders it onto a crisp white background, producing a JPG file that practically every device and program can open."
      },
      {
        "h": "Conversion walkthrough"
      },
      {
        "ol": [
          "Select your .ico file.",
          "Drop it into the ICO to JPG converter.",
          "Choose your desired JPG quality setting.",
          "Press Convert to JPG and download the result."
        ]
      },
      {
        "p": "The conversion runs in your browser, so the icon is not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-convert-jpg-to-webp",
    "title": "How to Convert JPG Photos to WebP for a Faster Website",
    "desc": "How to find the right WebP quality for your photos, and how to tell whether converting was worth it.",
    "date": "2026-10-06",
    "tool": "jpg-to-webp",
    "content": [
      {
        "p": "For photography portfolios, online storefronts, and online publications, image files represent the majority of total page weight. Converting JPG photos to WebP can make such pages noticeably lighter."
      },
      {
        "h": "The tangible benefits of WebP"
      },
      {
        "ul": [
          "Smaller files: WebP is usually smaller than a JPEG of similar visual quality, by an amount that depends on the photo.",
          "Faster loading: lighter images can improve loading measurements such as Largest Contentful Paint.",
          "Lower data usage for mobile site visitors browsing on limited data plans.",
          "Support in all current web browsers."
        ]
      },
      {
        "h": "Step by step conversion"
      },
      {
        "ol": [
          "Choose one or more JPG photographs.",
          "Set the quality slider. 80 to 85 is a good starting range.",
          "Press Convert to WebP.",
          "Download your optimized images and replace your existing heavy web assets."
        ]
      },
      {
        "p": "The conversion runs in your browser, and the photos are not uploaded."
      }
    ]
  },
  {
    "slug": "how-to-verify-email-addresses-online",
    "title": "How to Check an Email Address Before You Send",
    "desc": "What an email check can and cannot prove, which data leaves your browser during the lookup, and how to use the result sensibly.",
    "date": "2026-10-07",
    "tool": "email-verifier",
    "content": [
      {
        "p": "Sending emails to invalid, non-existent, or disposable addresses damages sender reputation and causes high bounce rates. Verifying an email address before sending helps keep your communication clean and professional."
      },
      {
        "h": "What makes an email address valid"
      },
      {
        "ul": [
          "RFC 5322 Syntax: The mailbox and domain follow standard formatting standards with valid characters and structure.",
          "Live Domain Resolution: The website domain actually exists on global DNS servers and is active.",
          "Mail Exchange (MX) Configuration: The domain administrator has configured active mail exchange servers ready to accept inbound emails.",
          "Disposable Filter: The domain is not an expiring burner inbox created for temporary throwaway use.",
          "Mailbox Identity: Determining whether the address belongs to an individual person or an organizational role mailbox."
        ]
      },
      {
        "h": "How the DocBrio checker works"
      },
      {
        "p": "The format check and the disposable domain check run in your browser. To see whether the domain has mail servers, the browser asks a public DNS service, and for that it sends the domain name only. The section on what leaves your browser, further down, explains this in detail."
      },
      {
        "h": "Step by step email verification"
      },
      {
        "ol": [
          "Enter or paste the email address you want to check.",
          "Click Verify Email Address or press Enter.",
          "Read the result of each check and the estimated score.",
          "Look at the suggested first and last name, which is a guess from the address.",
          "Use the direct website link to visit the associated organization domain.",
          "Review the detected email service provider, from Google Workspace to Microsoft 365 or custom corporate servers."
        ]
      },
      {
        "p": "Used with these limits in mind, a quick check catches typing errors and dead domains before they turn into bounced messages."
      }
    ]
  }
];

export const posts = [...guides, ...shorter.map((p) => ({ ...p, updated: '2026-10-10', content: [...p.content, ...(added[p.slug] || [])] }))];

export const getPost = (s) => posts.find((p) => p.slug === s);
