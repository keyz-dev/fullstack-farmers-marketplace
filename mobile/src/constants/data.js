const CATEGORIES = [
  {
    id: 1,
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", // Example: headphones on desk
  },
  {
    id: 2,
    name: "Fashion",
    image:
      "https://images.fastcompany.com/image/upload/f_webp,q_auto,c_fit,w_1024,h_1024/wp-cms/uploads/2020/12/04-forgotten-designers.jpg", // Example: clothing rack
  },
  {
    id: 3,
    name: "Home & Kitchen",
    image:
      "https://www.kitchenaid.com/is/image/content/dam/business-unit/kitchenaid/en-us/marketing-content/site-assets/page-content/pinch-of-help/filling-your-home-with-appliances/Filling-your-home-with-appliances-counter-3.jpg?fmt=png-alpha&qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&scl=1&constrain=fit,1", // Example: modern kitchen
  },
  {
    id: 4,
    name: "Beauty",
    image:
      "https://plus.unsplash.com/premium_photo-1683121409041-076759249d56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YmVhdXR5fGVufDB8fDB8fHww", // Example: skincare products
  },
  {
    id: 5,
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80", // Example: sports equipment
  },
  {
    id: 6,
    name: "Toys",
    image:
      "https://images.unsplash.com/photo-1593642632823-9b4c7f8e1a0d?auto=format&fit=crop&w=600&q=80", // Example: colorful toys
  },
  {
    id: 7,
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80", // Example: stack of books
  },
  {
    id: 8,
    name: "Automotive",
    image:
      "https://www.chuo-eng.co.jp/english/wp/wp-content/uploads/2022/02/iStock-859736630-scaled.jpg", // Example: car parts
  },
];

const PRODUCTS = [
  {
    _id: "1",
    name: "Leather Jacket",
    description:
      "Premium black leather jacket with a classic biker style crafted from genuine full-grain leather for unmatched durability and a luxurious feel. The jacket features an asymmetrical front zipper, snap-down lapels, and multiple functional pockets both inside and out. Quilted lining provides extra warmth during colder months without adding bulk to the streamlined silhouette. Metal hardware details add an authentic vintage appeal, while the tailored fit ensures a flattering look for various body types. Perfect for casual outings or adding an edgy element to more formal attire, this timeless piece will develop a unique patina over years of wear.",
    price: 129.99,
    vendor: "UrbanWear",
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    ],
    stock: 50,
  },
  {
    _id: "2",
    name: "Summer Floral Dress",
    description:
      "Lightweight floral dress perfect for summer outings featuring a vibrant garden-inspired print on breathable, 100% cotton fabric that keeps you cool even on the hottest days. The flattering A-line silhouette skims the body without clinging, while the adjustable spaghetti straps allow for a customized fit to suit your comfort level. A delicate sweetheart neckline adds a touch of feminine charm, complemented by the subtle ruffle detail along the hemline that falls just above the knee. The hidden side pockets add practical functionality without disrupting the dress's flowing lines. This versatile piece transitions effortlessly from daytime casual when paired with sandals to evening elegance with the right accessories.",
    price: 39.99,
    vendor: "FashionHub",
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    ],
    stock: 90,
  },
  {
    _id: "3",
    name: "Smartphone 12 Pro",
    description:
      "Latest generation smartphone with advanced camera features including a revolutionary quad-lens system with 108MP main sensor, ultrawide, telephoto, and dedicated macro lens for unparalleled photography capabilities in any lighting condition. The stunning 6.7-inch AMOLED display delivers true-to-life colors with 120Hz refresh rate for butter-smooth scrolling and gaming, protected by military-grade scratch-resistant glass. Powered by the newest octa-core processor and 12GB RAM, this device handles multitasking with ease while the 256GB of storage provides ample space for all your apps, photos, and videos. The 5000mAh battery supports all-day usage even under heavy workloads, with 65W fast charging that restores 70% battery in just 30 minutes. Additional features include under-display fingerprint sensor, facial recognition, IP68 water and dust resistance, and the latest connectivity options including 5G and Wi-Fi 6E.",
    price: 999.99,
    vendor: "TechieStore",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1510557880182-3c5aeea7f87b",
    ],
    stock: 30,
  },
  {
    _id: "4",
    name: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with deep bass and long battery life engineered with dual passive radiators and premium 45mm drivers that deliver immersive 360-degree sound with impressive clarity across all frequencies. The rugged, waterproof IPX7-rated design withstands submersion in water up to 3 feet for 30 minutes, making it perfect for pool parties, beach outings, or use in the shower. Advanced Bluetooth 5.2 technology ensures stable connections up to 100 feet away from your device, with easy pairing and compatibility with all smartphones, tablets, and computers. The rechargeable lithium-ion battery provides an industry-leading 24 hours of continuous playback at moderate volume levels, with a quick-charge feature giving you 3 hours of play time from just 10 minutes of charging. Additional features include a built-in microphone for hands-free calls, voice assistant integration, and the ability to wirelessly connect multiple speakers for an enhanced stereo experience.",
    price: 59.99,
    vendor: "SoundWave",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167",
    ],
    stock: 80,
  },
  {
    _id: "5",
    name: "Organic Lip Balm",
    description:
      "Natural, organic lip balm for soft and hydrated lips formulated with a nourishing blend of organic beeswax, virgin coconut oil, and shea butter that creates a protective barrier against harsh environmental elements while deeply moisturizing dry, chapped skin. Infused with vitamin E and antioxidant-rich rosehip oil to promote healing and regeneration of delicate lip tissue, this balm addresses multiple concerns from seasonal dryness to sun damage. The subtle natural vanilla scent comes from pure essential oils rather than artificial fragrances, making it suitable for those with sensitivities or allergies. Each tube is handcrafted in small batches to ensure optimal freshness and efficacy, with ingredients sourced from certified organic farms supporting sustainable agricultural practices. Free from parabens, petroleum, synthetic colors, and preservatives, this lip balm provides guilt-free hydration that's as kind to your body as it is to the planet.",
    price: 7.99,
    vendor: "GlowBeauty",
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    ],
    stock: 150,
  },
  {
    _id: "6",
    name: "Luxury Perfume",
    description:
      "Elegant perfume with floral and woody notes created by world-renowned master perfumer Isabelle Dumont, featuring a sophisticated blend of rare ingredients sourced from across the globe. The fragrance opens with sparkling top notes of Italian bergamot, pink pepper, and delicate pear blossom that immediately captivate the senses with their bright, inviting character. The heart reveals an exquisite bouquet of Bulgarian rose absolute, jasmine sambac, and ylang-ylang, creating a feminine and romantic impression that evolves beautifully throughout wear. Base notes of Madagascar vanilla, sandalwood, and white amber provide a warm, lingering finish that adds depth and sensuality while ensuring impressive longevity on the skin for up to 12 hours. The crystal flacon is hand-crafted by artisan glassmakers, featuring a gold-plated cap adorned with a single Swarovski crystal, making it as much a vanity table showpiece as a personal fragrance. Presented in a satin-lined gift box with a handwritten certificate of authenticity, this perfume makes an unforgettable gift for special occasions or a luxurious personal indulgence.",
    price: 59.99,
    vendor: "Scentique",
    category: "Beauty",
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
    ],
    stock: 70,
  },
  {
    _id: "7",
    name: "Adjustable Dumbbells",
    description:
      "Space-saving adjustable dumbbells for versatile workouts featuring an innovative dial system that allows quick weight changes from 5 to 52.5 pounds per dumbbell in 2.5-pound increments, eliminating the need for multiple sets of weights. The ergonomic handle is wrapped in knurled steel with a comfortable non-slip grip that remains secure even during intense workouts, preventing hand fatigue and reducing callus formation. Each weight plate is coated with a durable, noise-reducing nylon material that protects both your floors and the weights themselves from damage during use or when setting them down between sets. The included storage tray keeps weights organized and accessible while not in use, with a compact footprint measuring just 16 inches by 8 inches to maximize space efficiency in home gyms. Compatible with most standard weight benches and featuring a balanced design that allows for proper form during various exercises from shoulder presses to lunges, these dumbbells offer the versatility of an entire rack of traditional weights in one intelligent system.",
    price: 89.99,
    vendor: "FitLife",
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
    ],
    stock: 40,
  },
  {
    _id: "8",
    name: "Running Shoes",
    description:
      "Lightweight running shoes designed for comfort and speed featuring revolutionary responsive foam technology that provides 20% more energy return with each stride compared to traditional EVA midsoles, helping to reduce fatigue during long runs. The breathable engineered mesh upper adapts to your foot's natural movement and expansion throughout your run, with targeted zones of support and flexibility precisely placed based on biomechanical research. An anatomically-designed heel counter cradles the foot for a secure, locked-in feel without pressure points, while the padded tongue and collar provide additional comfort around the ankle and instep. The durable rubber outsole features a data-driven tread pattern with deeper lugs in high-wear areas, offering superior traction on both wet and dry surfaces without adding unnecessary weight to the shoe. Additional features include reflective elements for visibility during early morning or evening runs, quick-lace system for easy on/off, and removable OrthoLite insoles that provide lightweight cushioning while managing moisture and odor.",
    price: 69.99,
    vendor: "Sporty",
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1515548211234-6e6cfc5e8a06",
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3fd2",
    ],
    stock: 65,
  },
  {
    _id: "9",
    name: "Ceramic Dinnerware Set",
    description:
      "Elegant ceramic dinnerware set for everyday dining crafted from high-quality, lead-free porcelain clay fired at 2,400°F for exceptional durability and a smooth, non-porous finish that resists chips, scratches, and stains. The 16-piece collection includes four place settings, each with a 10.5-inch dinner plate, 8-inch salad plate, 6-inch bread plate, and 16-ounce soup/cereal bowl designed to stack efficiently for compact storage in kitchen cabinets. The minimalist design features a subtle reactive glaze technique that creates unique variations in the soft white finish, ensuring no two pieces are exactly alike while still maintaining a cohesive look across the entire set. Versatile enough for casual family meals yet sophisticated enough for dinner parties, these dishes transition seamlessly from microwave to table to dishwasher without losing their luster over time. The plates feature a slightly raised edge that elegantly frames your food while preventing spills, and the bowls have an optimized depth-to-width ratio perfect for everything from morning cereal to evening soup.",
    price: 59.99,
    vendor: "HomeEssentials",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
    ],
    stock: 55,
  },
  {
    _id: "10",
    name: "Automatic Coffee Maker",
    description:
      "Programmable coffee maker for fresh brews every morning featuring an intuitive digital interface that allows you to schedule brewing up to 24 hours in advance, ensuring your coffee is ready precisely when you need it. The precision temperature control system heats water to the optimal brewing range of 195-205°F to extract the full flavor spectrum from your coffee grounds without the bitterness caused by overheating. A specially designed showerhead evenly distributes water over the grounds for complete saturation and balanced extraction, while the adjustable brew strength selector lets you customize each pot from light to bold based on personal preference. The thermal carafe is vacuum-sealed with double-wall stainless steel construction that maintains coffee temperature for up to 4 hours without a warming plate, preserving flavor without developing the burnt taste associated with traditional glass carafes left on heating elements. Additional features include a built-in water filtration system that removes chlorine and impurities, a self-cleaning cycle that removes mineral buildup, and an auto-pause function that lets you sneak a cup before brewing completes.",
    price: 79.99,
    vendor: "KitchenPro",
    category: "Home & Kitchen",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
    ],
    stock: 35,
  },
  {
    _id: "11",
    name: "The Midnight Library",
    description:
      "A bestselling novel about choices, regrets, and the infinite possibilities of life written by acclaimed author Matt Haig, who masterfully blends philosophical depth with accessible storytelling in this thought-provoking literary journey. The story follows Nora Seed, who finds herself in a mysterious library between life and death, where each book represents an alternative version of her life had she made different choices, offering her the extraordinary opportunity to experience the roads not taken. Through vivid, emotionally resonant prose, Haig explores profound questions about happiness, purpose, and the ripple effects of our seemingly small decisions, while maintaining a narrative that's both compelling and deeply human. Winner of multiple literary awards and featured on numerous 'Best Books of the Year' lists, this novel has touched readers worldwide with its hopeful message about second chances and finding meaning in our existing lives. Perfect for book clubs and individual reflection alike, The Midnight Library invites readers to consider their own paths not taken while ultimately celebrating the unique journey that makes each of us who we are.",
    price: 14.99,
    vendor: "BookWorld",
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b",
    ],
    stock: 120,
  },
  {
    _id: "12",
    name: "Children's Dinosaur Puzzle",
    description:
      "Colorful 48-piece dinosaur puzzle for kids ages 4 and up featuring scientifically accurate illustrations of 12 different prehistoric creatures set against a vibrant Jurassic landscape backdrop, created in collaboration with paleontologists from the Natural History Museum. Each puzzle piece is crafted from thick, durable cardboard with a special coating that resists wear even after hundreds of assemblies, while the precision-cut interlocking design ensures pieces fit together perfectly without frustrating young puzzle enthusiasts. The completed puzzle measures 18 by 24 inches—large enough to be engaging but not overwhelming for small hands and limited table space—and includes a reference poster showing the completed image to aid children in their assembly process. Educational information about each dinosaur species is printed on the back of corresponding puzzle pieces, turning playtime into a learning opportunity about prehistoric life, fostering both cognitive development and scientific curiosity. The eco-friendly packaging doubles as a storage box with a rope handle for easy transport, making this puzzle perfect for home use or as an activity for road trips and visits to grandparents.",
    price: 12.99,
    vendor: "ToyBox",
    category: "Toys",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    ],
    stock: 80,
  },
  {
    _id: "13",
    name: "Remote Control Sports Car",
    description:
      "High-speed remote control car with rechargeable battery and LED lights capable of reaching impressive speeds up to 25 mph thanks to its powerful brushless motor system and aerodynamic body design inspired by professional racing vehicles. The precision 2.4GHz remote control offers interference-free operation with a range of up to 300 feet, featuring proportional steering and throttle for nuanced control that mimics real driving dynamics, allowing drivers to perform drifts, quick turns, and precise maneuvers. Built with a durable polycarbonate shell and reinforced chassis that withstands impacts and rollovers, this RC car includes metal shock absorbers with adjustable suspension settings that can be customized for different terrains from smooth pavement to rough off-road conditions. The included 7.4V 1200mAh lithium-polymer battery provides up to 25 minutes of continuous play time on a single charge, with an efficient USB charging system that reaches full power in just 90 minutes. Additional features include ultra-bright LED headlights and taillights for nighttime racing, rubber tires with special tread patterns for enhanced grip, and a low-battery warning system to prevent unexpected power loss during play.",
    price: 34.99,
    vendor: "ToyBox",
    category: "Toys",
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
    ],
    stock: 60,
  },
  {
    _id: "14",
    name: "Car Vacuum Cleaner",
    description:
      "Portable handheld vacuum cleaner for car interiors, with powerful suction generated by a high-efficiency 120W motor that creates 8,000Pa of cleaning power—strong enough to tackle embedded dirt, pet hair, food crumbs, and fine dust particles from even the hardest-to-reach areas of your vehicle. The ergonomic design weighs just 2.4 pounds with perfect weight distribution that reduces hand fatigue during extended cleaning sessions, while the noise reduction technology keeps operation at a comfortable 75dB level. Equipped with specialized attachments including a crevice tool for tight spaces between seats, a brush nozzle for upholstery, and an extension hose that adds 20 inches of reach for cleaning under seats and in trunk spaces without awkward bending or stretching. The washable HEPA filtration system captures 99.97% of particles as small as 0.3 microns, making it ideal for allergy sufferers and ensuring that dust doesn't recirculate while cleaning. Powered by your car's 12V outlet with a 16-foot cord that reaches throughout even large vehicles, this vacuum includes a convenient storage bag that keeps all accessories organized between uses.",
    price: 29.99,
    vendor: "AutoCare",
    category: "Automotive",
    images: [
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    ],
    stock: 45,
  },
  {
    _id: "15",
    name: "All-Weather Car Floor Mats",
    description:
      "Durable, waterproof floor mats designed to protect your car's interior featuring a proprietary tri-layer construction with a rigid core sandwiched between a non-slip bottom layer and a textured top surface that traps liquids, mud, snow, and debris in deep channels to prevent them from contacting your vehicle's carpet. Each set is precision-laser measured for your specific vehicle make and model to ensure perfect wall-to-wall coverage without shifting during use, with raised edges that contain up to 32 ounces of liquid without spillover—ideal for unexpected rainstorms or winter slush. The advanced thermoplastic elastomer material remains flexible in temperatures ranging from -50°F to 150°F without cracking or warping, while offering superior chemical resistance against road salt, motor oil, and common spills like coffee. The innovative X-pattern surface texture provides enhanced foot traction to prevent slipping when entering or exiting your vehicle, while also being easy to clean with just a garden hose or damp cloth—no special cleaners required. These low-maintenance mats come with a lifetime warranty against manufacturing defects, ensuring long-lasting protection that maintains your vehicle's resale value by keeping the original floor covering in pristine condition.",
    price: 59.99,
    vendor: "AutoCare",
    category: "Automotive",
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d",
      "https://images.unsplash.com/photo-1511918984145-48de785d4c4e",
    ],
    stock: 35,
  },
  {
    _id: "16",
    name: "Atomic Habits",
    description:
      "A practical guide to building good habits and breaking bad ones, by James Clear, this groundbreaking book distills complex behavioral science research into an accessible framework that has helped millions transform their lives through the power of tiny changes. Drawing on neuroscience, psychology, and real-world examples from Olympic gold medalists to Fortune 500 executives, Clear explains how habits form and how we can harness this knowledge to create positive changes that compound over time like interest in a bank account. The book introduces the Four Laws of Behavior Change—make it obvious, make it attractive, make it easy, and make it satisfying—providing actionable strategies for implementing each one to design an environment that makes good habits inevitable and bad habits impossible. Through engaging storytelling and evidence-based insights, readers learn why small 1% improvements accumulate into remarkable results, how to overcome a lack of motivation and willpower, and how to recover when you fall off track with proven strategies for getting back on course. Perfect for anyone seeking personal or professional growth, this Wall Street Journal bestseller includes implementation guides, tracking templates, and reflection questions at the end of each chapter to help readers apply these principles immediately.",
    price: 16.99,
    vendor: "BookWorld",
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    ],
    stock: 100,
  },
];

const ONBOARDINGSLIDES = [
  {
    id: "customer",
    title: "Shop as a Customer",
    description:
      "Explore a wide range of products from trusted vendors. Enjoy seamless ordering and quick delivery.",
    image: require("../assets/images/onboarding/Shopping.png"),
  },
  {
    id: "vendor",
    title: "Sell as a Farmer",
    description:
      "List your products, manage inventory, and grow your business through our powerful vendor tools.",
    image: require("../assets/images/onboarding/vendor.png"),
  },
  {
    id: "delivery",
    title: "Deliver with Ease",
    description:
      "Join our delivery team to fulfill orders swiftly and earn with flexibility.",
    image: require("../assets/images/onboarding/delivery.png"),
  },
  {
    id: "final",
    title: "Let’s Get Started",
    description: "Choose your role and start exploring our marketplace!",
    image: require("../assets/images/onboarding/purchase 2.png"),
  },
];

export { CATEGORIES, PRODUCTS, ONBOARDINGSLIDES };
