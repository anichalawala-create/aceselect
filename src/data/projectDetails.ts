export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  vertical: "digital" | "banking" | "branding" | "turnkey";
  location: string;
  city: string;
  state: string;
  completion: string;
  scale: string;
  heroImage: string;
  gallery: string[];
  description: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  specs: { label: string; value: string }[];
  highlights: string[];
  clientLogo?: string;
  nextProjectId?: string;
}

export const projectDetails: ProjectDetail[] = [
  // 1. Digital Displays & Active LED
  {
    id: "kashi-vishwanath-temple",
    slug: "kashi-vishwanath-temple",
    title: "Shri Kashi Vishwanath Temple Active LED Network",
    subtitle: "High-Durability Outdoor Active LED Video Walls for Sacred Spiritual Corridors",
    client: "Shri Kashi Vishwanath Temple Trust / Govt. of Uttar Pradesh",
    category: "Outdoor Active LED Video Wall",
    vertical: "digital",
    location: "Varanasi, Uttar Pradesh",
    city: "Varanasi",
    state: "Uttar Pradesh",
    completion: "Commissioned",
    scale: "12 Primary Corridors & Holy Gateways",
    heroImage: "/images/projects/proj-kashi-vishwanath.jpg",
    gallery: [
      "/images/projects/proj-kashi-vishwanath.jpg",
      "/images/projects/photo-p17-2.jpeg",
      "/images/projects/photo-p17-5.jpeg",
      "/images/projects/project-varanasi-kashi.jpg"
    ],
    description: "Deployment of heavy-duty, all-weather IP65 Active LED video walls across holy shrines, parikrama corridors, and pilgrim entry gateways at the world-renowned Shri Kashi Vishwanath Dham in Varanasi. Engineered to endure continuous 24/7 devotional broadcasting, intense summer heat exceeding 45°C, high humidity along the Ganges, and massive footfalls of over 1,00,000 pilgrims daily.",
    challenge: "Executing seamless structural installations without impacting ancient heritage masonry, while ensuring the display hardware can withstand severe North Indian weather fluctuations, continuous dust exposure, and uninterrupted 24/7 live video feeds.",
    solution: "Custom engineered weather-sealed die-cast aluminum cabinets featuring IP65 hermetic sealing, conformal acrylic PCB coating, and high-efficiency common cathode driver ICs. Integrated automated ambient light sensors adjust screen luminance dynamically from 7,000 nits during direct sunlight to comfortable viewing levels at dusk, synchronized via JIO SOFTWARE 256-bit encrypted cloud servers.",
    metrics: [
      { label: "Daylight Brightness", value: "7,000+ Nits" },
      { label: "Daily Footfall", value: "1,00,000+" },
      { label: "Operating Life", value: "1,00,000 Hrs" },
      { label: "Commercial Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Display Technology", value: "Outdoor High-Brightness SMD Gold Wire" },
      { label: "Pixel Pitch", value: "P3.9 / P4.8 High-Resolution Outdoor" },
      { label: "Ingress Protection", value: "IP65 Front & Rear Weatherproof" },
      { label: "Refresh Rate", value: "3840Hz (Flicker-Free Broadcast Grade)" },
      { label: "Cabinet Construction", value: "Die-Cast Aluminum with Thermal Dissipation" },
      { label: "Cloud Software", value: "JIO SOFTWARE Cloud CMS (Indian Servers)" },
      { label: "Operating Temperature", value: "-10°C to +55°C" },
      { label: "Electrical Protection", value: "Dual Stage Surge Protection & Earth Grounding" },
    ],
    highlights: [
      "24/7 continuous uninterrupted devotional broadcast across 12 spiritual checkpoints",
      "Conforms to Archaeological and Heritage Structural Safety Guidelines",
      "Centralized cloud scheduling and automated playback health monitoring",
      "Backed by dedicated regional service team with guaranteed 4-hour SLA"
    ],
    nextProjectId: "bkc-curved-architectural-billboard"
  },
  {
    id: "bkc-curved-architectural-billboard",
    slug: "bkc-curved-architectural-billboard",
    title: "BKC Curved Architectural DOOH Billboard",
    subtitle: "Iconic Curved P3.9 Outdoor LED Video Wall in Mumbai's Premier Financial District",
    client: "Bandra-Kurla Complex Commercial Media",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Bandra-Kurla Complex, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "High-Traffic Financial Hub Corner Junction",
    heroImage: "/images/projects/proj-bkc-mumbai.jpg",
    gallery: [
      "/images/projects/proj-bkc-mumbai.jpg",
      "/images/projects/photo-p18-0.jpeg",
      "/images/projects/photo-p18-1.jpeg",
      "/images/projects/photo-p18-4.jpeg"
    ],
    description: "An iconic, large-format curved outdoor Active LED billboard mounted on a premier commercial banking tower in Bandra Kurla Complex (BKC), Mumbai. Engineered with a precision radiused curved steel superstructure, delivering seamless ultra-high-definition advertising playback with wide viewing angles across multiple arterial traffic corridors.",
    challenge: "Fabricating and mounting a seamless curved LED structure that matches the architectural sweep of the building facade while complying with stringent municipal wind load shear regulations and coastal monsoon conditions.",
    solution: "Utilized customized die-cast aluminum curved angled cabinets with seamless edge interlocking. Mounted on a heavy-gauge structural steel framework engineered for 150 km/h wind gusts, coupled with front-serviceable magnet modules for rapid roadside maintenance.",
    metrics: [
      { label: "Peak Luminance", value: "7,500 Nits" },
      { label: "Curvature Radius", value: "Custom Radiused" },
      { label: "Daily Impressions", value: "3,50,000+" },
      { label: "Uptime Rating", value: "99.98%" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P3.9 Outdoor Seamless Curve" },
      { label: "Contrast Ratio", value: "5000:1 Deep Black Mask" },
      { label: "Viewing Angle", value: "160° Horizontal / 140° Vertical" },
      { label: "Maintenance Access", value: "100% Front & Rear Serviceable" },
      { label: "Weatherproofing", value: "IP66 Sealed Marine-Grade Hardware" },
      { label: "Power Efficiency", value: "Common Cathode 30% Energy Saving" },
    ],
    highlights: [
      "Custom curved architectural integration without visible cabinet seams",
      "Smart light sensor integration for automatic day/night dimming",
      "Redundant signal and power loops to prevent blackouts",
      "Remote diagnostics and automated scheduled content playout"
    ],
    nextProjectId: "siripuram-smart-city-led"
  },
  {
    id: "siripuram-smart-city-led",
    slug: "siripuram-smart-city-led",
    title: "Siripuram Smart City Active LED Wall",
    subtitle: "Civic Broadcasting & Smart City Information Hub at Major Urban Junction",
    client: "Visakhapatnam Smart City Corporation / GVMC",
    category: "Smart City Infrastructure",
    vertical: "digital",
    location: "Siripuram Junction, Visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    completion: "Commissioned",
    scale: "Central Smart City Traffic Junction",
    heroImage: "/images/projects/proj-visakhapatnam.jpg",
    gallery: [
      "/images/projects/proj-visakhapatnam.jpg",
      "/images/projects/photo-p20-0.jpeg",
      "/images/projects/photo-p20-1.jpeg",
      "/images/projects/photo-p20-2.jpeg"
    ],
    description: "Civic broadcasting and emergency alert Active LED video wall deployed at the central Siripuram traffic intersection in Visakhapatnam. Directly integrated with the Integrated Command and Control Centre (ICCC), the display provides citizens with real-time public interest messaging, traffic advisories, municipal announcements, and weather emergency alerts.",
    challenge: "Engineering an outdoor gantry display situated directly in a high-corrosion coastal marine environment with high humidity, saline air, and intense monsoon storms.",
    solution: "Manufactured using marine-grade treated steel and heavy anodized aluminum frames with specialized double-layer conformal coating on all internal electronic components. Direct fiber-optic connectivity links the screen to the municipal command center.",
    metrics: [
      { label: "Command Center", value: "ICCC Linked" },
      { label: "Protection", value: "IP66 Coastal" },
      { label: "Daily Reach", value: "2,00,000+" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Module Type", value: "IP66 Outdoor Active SMD" },
      { label: "Display Pitch", value: "P4.0 High Definition" },
      { label: "Data Transmission", value: "Encrypted Fiber Optic & 4G/5G Failover" },
      { label: "Cooling System", value: "Thermo-regulated Quiet Ventilation" },
      { label: "Input Feeds", value: "Live HDMI, SDI, IP Stream & Emergency Override" },
    ],
    highlights: [
      "Zero-latency emergency broadcast trigger from central police/municipal ICCC",
      "Anti-reflective high-contrast mask for crystal-clear readability under midday sun",
      "Engineered to withstand coastal cyclonic winds up to 160 km/h",
      "Full remote diagnostics with screen health telemetrics"
    ],
    nextProjectId: "marine-drive-dooh-display"
  },
  {
    id: "marine-drive-dooh-display",
    slug: "marine-drive-dooh-display",
    title: "Marine Drive Iconic Seaface DOOH Display",
    subtitle: "High-Visibility DOOH Video Wall on Mumbai's Celebrated Promenade",
    client: "Mumbai Metropolitan OOH Media",
    category: "DOOH Infrastructure",
    vertical: "digital",
    location: "Marine Drive Promenade, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Active Commercial Operations",
    scale: "Queen's Necklace High-Footfall Arterial Corridor",
    heroImage: "/images/projects/proj-marine-drive.jpg",
    gallery: [
      "/images/projects/proj-marine-drive.jpg",
      "/images/projects/photo-p27-0.png",
      "/images/projects/photo-p27-1.jpeg",
      "/images/projects/photo-p27-5.jpeg"
    ],
    description: "High-impact outdoor digital out-of-home (DOOH) Active LED display prominently located along Mumbai's prestigious Marine Drive promenade. Positioned along one of the country's most iconic sea-facing corridors, this landmark installation captures high-net-worth vehicular traffic and hundreds of thousands of daily pedestrians.",
    challenge: "Harsh Arabian Sea marine climate characterized by perpetual salt fog, high humidity, corrosion, and extreme monsoon precipitation.",
    solution: "Specially formulated marine-grade stainless-steel structural hardware, hermetically isolated electronic chambers, anti-corrosion PCB dipping, and high-lumen 7,500 nits LED modules designed for extreme durability.",
    metrics: [
      { label: "Luminance", value: "7,500 Nits" },
      { label: "Saline Resistance", value: "Marine Class" },
      { label: "Vehicle Traffic", value: "1,80,000 / Day" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P4.0 Outdoor High Definition" },
      { label: "Cabinet Ingress", value: "IP66 Sealed Enclosure" },
      { label: "Frame Finish", value: "Marine Grade Powder Coated Steel" },
      { label: "Luminance Control", value: "Automated 256-Step Optical Sensor" },
      { label: "CMS Platform", value: "JIO SOFTWARE Cloud Playout" },
    ],
    highlights: [
      "Ultra-high visibility daylight playback along Mumbai's coastline",
      "Engineered for 100% resistance to coastal saline moisture",
      "Dynamic programmatic advertising playout via centralized cloud",
      "Turnkey civil foundation, electrical substations, and structural engineering"
    ],
    nextProjectId: "barakhamba-road-delhi"
  },
  {
    id: "barakhamba-road-delhi",
    slug: "barakhamba-road-delhi",
    title: "Barakhamba Road Commercial DOOH",
    subtitle: "High-Footfall Commercial Corridor Outdoor Video Wall",
    client: "New Delhi Commercial Media Network",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Barakhamba Road, Connaught Place, New Delhi",
    city: "New Delhi",
    state: "Delhi NCR",
    completion: "Active Operations",
    scale: "Central Business District Major Junction",
    heroImage: "/images/projects/proj-delhi-barakhamba.jpg",
    gallery: [
      "/images/projects/proj-delhi-barakhamba.jpg",
      "/images/projects/photo-p28-0.jpeg"
    ],
    description: "Prime outdoor commercial DOOH screen situated on Barakhamba Road within the high-density Connaught Place commercial district in the heart of New Delhi. Strategically positioned to command the attention of corporate executives, commuters, and international business travelers.",
    challenge: "Severe seasonal temperature swings ranging from 4°C in winter to 48°C in peak summer, combined with high airborne particulate matter and heavy traffic vibrations from nearby metro tunnels.",
    solution: "Equipped with positive pressure filtered ventilation bays, industrial-grade heat exchanger systems, anti-vibration rubber isolation dampers, and ultra-durable SMD gold-wire LED diodes.",
    metrics: [
      { label: "Daily Viewership", value: "2,50,000+" },
      { label: "Temperature Range", value: "-5°C to 50°C" },
      { label: "Viewing Distance", value: "15m - 200m" },
      { label: "Display Life", value: "1,00,000 Hrs" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P4.8 Outdoor Robust" },
      { label: "Contrast Ratio", value: "4500:1 High Contrast" },
      { label: "Brightness", value: "6,500 Nits Daylight Calibrated" },
      { label: "Cooling", value: "Thermostatic Dual-Chamber Fans" },
    ],
    highlights: [
      "Capital commercial core visibility across multi-lane junction",
      "Robust thermal regulation for North Indian climate extremes",
      "Centralized 256-bit encrypted content upload and scheduling",
      "Rapid municipal sign-off and NDMC structural compliance"
    ],
    nextProjectId: "chitrakoot-jaipur-led"
  },
  {
    id: "chitrakoot-jaipur-led",
    slug: "chitrakoot-jaipur-led",
    title: "Chitrakoot Commercial LED Display",
    subtitle: "High-Contrast Roadside Commercial LED Display in Rajasthan",
    client: "Chitrakoot Commercial Properties",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Chitrakoot, Jaipur, Rajasthan",
    city: "Jaipur",
    state: "Rajasthan",
    completion: "Operational",
    scale: "Arterial High-Street Roadside Installation",
    heroImage: "/images/projects/proj-jaipur-chitrakoot.jpg",
    gallery: [
      "/images/projects/proj-jaipur-chitrakoot.jpg",
      "/images/projects/photo-p29-1.jpeg",
      "/images/projects/photo-p29-2.jpeg"
    ],
    description: "High-performance outdoor roadside Active LED commercial display installed along the prominent Chitrakoot retail and commercial corridor in Jaipur. Provides regional and national advertisers with vibrant, flicker-free brand presentations.",
    challenge: "Extreme desert summer temperatures, intense ultraviolet exposure, and seasonal sandstorms that degrade standard commercial electronics.",
    solution: "Integrated specialized anti-UV polycarbonate module masks, dust-proof sealed cable interconnects, and an advanced cooling layout to dissipate heat efficiently without drawing ambient sand into electrical compartments.",
    metrics: [
      { label: "Peak Luminance", value: "7,000 Nits" },
      { label: "Dust Rating", value: "IP65 Hermetic" },
      { label: "Daily Reach", value: "1,20,000" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P4.8 Outdoor Heavy Duty" },
      { label: "Anti-UV Rating", value: "Grade 4 Polycarbonate Mask" },
      { label: "Operating Life", value: "1,00,000 Hours" },
      { label: "Control System", value: "JIO Cloud CMS" },
    ],
    highlights: [
      "Engineered specifically for arid desert heat and sun exposure",
      "Vibrant high-color-gamut advertising delivery",
      "Low maintenance overhead with rear technician service gantry",
      "Turnkey structural fabrication and foundation piling"
    ],
    nextProjectId: "bkc-executive-banking-elobby"
  },
  {
    id: "bkc-executive-banking-elobby",
    slug: "bkc-executive-banking-elobby",
    title: "BKC Executive Banking E-Lobby & Video Wall",
    subtitle: "Turnkey Design-to-Build Corporate E-Lobby with Fine-Pitch Active LED",
    client: "Nationalized Banking Institution",
    category: "Indoor Active LED & Millwork",
    vertical: "turnkey",
    location: "BKC Financial Center, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Turnkey Completed",
    scale: "Flagship Corporate Banking Branch & Executive Atrium",
    heroImage: "/images/projects/proj-bkc-elobby.jpg",
    gallery: [
      "/images/projects/proj-bkc-elobby.jpg",
      "/images/projects/photo-p21-0.jpeg",
      "/images/projects/photo-p21-1.jpeg",
      "/images/projects/photo-p21-3.jpeg"
    ],
    description: "A complete turnkey design-to-build transformation of an executive corporate banking lobby in Bandra-Kurla Complex, Mumbai. Encompassing fine-pitch P1.5 indoor Active LED video walls, precision architectural joinery, automated digital banking touch-kiosks, acoustic ceiling treatments, and centralized cloud CMS integration.",
    challenge: "Delivering a comprehensive corporate interior overhaul and sensitive electronics integration in a functioning corporate headquarters within an aggressive 60-day schedule with zero disturbance to daytime banking operations.",
    solution: "Prefabricated modular acoustic wall systems and precision CNC joinery at ACE SELECT's central manufacturing workshop. Deployed clean-room dust-free installation teams for nocturnally staged display mounting and calibration.",
    metrics: [
      { label: "Turnkey Scope", value: "Design to Build" },
      { label: "Display Pitch", value: "P1.5 Fine Pitch" },
      { label: "Execution Time", value: "60 Days" },
      { label: "Scale", value: "₹6.1 Cr Fitout" },
    ],
    specs: [
      { label: "LED Pitch", value: "P1.5 Ultra-Fine Pitch Indoor SMD" },
      { label: "Gray Level", value: "16-Bit Processing" },
      { label: "Millwork", value: "Fire-Retardant Architectural Acoustic Panels" },
      { label: "CMS Integration", value: "Centralized Banking Content Server" },
      { label: "Lighting", value: "Architectural 3000K Warm Ambient Illumination" },
    ],
    highlights: [
      "Flawless zero-bezel architectural video wall integration",
      "Complete acoustic and spatial engineering under one roof",
      "Automated teller and customer self-service digital integration",
      "Recognized by client management as regional benchmark facility"
    ],
    nextProjectId: "lower-parel-commercial-tower"
  },
  {
    id: "lower-parel-commercial-tower",
    slug: "lower-parel-commercial-tower",
    title: "Lower Parel Commercial Tower LED",
    subtitle: "High-Rise Corporate Tower Atrium Active LED Installation",
    client: "Lower Parel Commercial Realty",
    category: "Corporate LED Display",
    vertical: "digital",
    location: "Lower Parel Business District, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Corporate Headquarters Atrium & Facade",
    heroImage: "/images/projects/proj-lower-parel.jpg",
    gallery: [
      "/images/projects/proj-lower-parel.jpg",
      "/images/projects/photo-p25-0.jpeg",
      "/images/projects/photo-p25-6.jpeg"
    ],
    description: "High-spec corporate atrium Active LED display engineered into a landmark commercial business tower in Lower Parel, Mumbai. Welcomes multinational executives with dynamic branding, financial ticker broadcasts, and visual art installations.",
    challenge: "Elevated installation heights within a busy operational commercial lobby requiring cantilevered rigging without interfering with pedestrian movement.",
    solution: "Engineered ultra-lightweight carbon-alloy die-cast cabinets hung on high-tensile aircraft cables with magnetic front-service module access.",
    metrics: [
      { label: "Resolution", value: "4K UHD" },
      { label: "Viewing Angle", value: "170° Wide" },
      { label: "Refresh Rate", value: "3840Hz" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P2.0 Indoor Fine Pitch" },
      { label: "Module Type", value: "SMD Black Mask" },
      { label: "Color Depth", value: "14-Bit Grayscale" },
      { label: "Weight", value: "Only 6.5 kg per cabinet" },
    ],
    highlights: [
      "Architectural atrium centerpiece in premier commercial tower",
      "Flicker-free high refresh rate for pristine broadcast quality",
      "Centralized cloud scheduling on Indian JIO SOFTWARE servers",
      "Zero acoustic disturbance fanless silent cooling"
    ],
    nextProjectId: "mehboob-studio-bandra"
  },
  {
    id: "mehboob-studio-bandra",
    slug: "mehboob-studio-bandra",
    title: "Mehboob Studio Production LED",
    subtitle: "Dual Outdoor and Indoor High Refresh Rate Production LED Display",
    client: "Mehboob Studios / Media Production",
    category: "Film & Entertainment Display",
    vertical: "digital",
    location: "Bandra West, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Historic Film Studio Compound & Production Stages",
    heroImage: "/images/projects/proj-mehboob-bandra.jpg",
    gallery: [
      "/images/projects/proj-mehboob-bandra.jpg"
    ],
    description: "Dual indoor production and outdoor courtyard Active LED display installation at Mumbai's historic Mehboob Studios in Bandra West. Specially calibrated for camera capture with 7680Hz ultra-high refresh rate, zero moiré patterns, and HDR10 color fidelity.",
    challenge: "Camera capture without scan-line flicker, chromatic aberration, or moiré interference during high-end cinematic filming and live broadcast shoots.",
    solution: "Integrated premium PWM driver ICs, custom optical anti-glare masks, and genlock synchronization capabilities for multi-camera live video production.",
    metrics: [
      { label: "Refresh Rate", value: "7680Hz" },
      { label: "Color Gamut", value: "DCI-P3 98%" },
      { label: "Moiré Reduction", value: "Optical Mask" },
      { label: "Genlock", value: "Hardware Sync" },
    ],
    specs: [
      { label: "LED Pitch", value: "P2.5 Production Grade" },
      { label: "Brightness Range", value: "800 - 4500 Nits Variable" },
      { label: "Color Calibration", value: "SpectraCal 3D LUT" },
      { label: "Cabinet Style", value: "Modular Quick-Lock Rental/Fixed" },
    ],
    highlights: [
      "Broadcast-grade camera-ready performance without flicker",
      "Deployed at India's most prestigious cinema and media hub",
      "Dual capability for indoor virtual production and outdoor screening",
      "Backed by 24/7 dedicated technical support"
    ],
    nextProjectId: "sandoz-house-worli"
  },
  {
    id: "sandoz-house-worli",
    slug: "sandoz-house-worli",
    title: "Sandoz House Commercial Facade",
    subtitle: "High-Lumen Corporate Building Video Display System",
    client: "Commercial Corporate Directorate",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Worli, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Iconic Commercial Facade Facing Arterial Flyover",
    heroImage: "/images/projects/proj-worli-mumbai.jpg",
    gallery: [
      "/images/projects/proj-worli-mumbai.jpg"
    ],
    description: "High-lumen corporate building architectural video display system installed on Sandoz House in Worli, Mumbai. Dominates the visual skyline along one of South Mumbai's busiest commercial transit corridors.",
    challenge: "High wind exposure, coastal moisture, and maintaining clear visibility from passing elevated flyover traffic.",
    solution: "Heavy-gauge structural frame with aerodynamically designed wind baffles and 7,000 nits high-contrast SMD LEDs with automatic luminance adjustment.",
    metrics: [
      { label: "Luminance", value: "7,000 Nits" },
      { label: "Flyover Visibility", value: "500m Line of Sight" },
      { label: "Protection", value: "IP66 Rated" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P4.8 Outdoor Architectural" },
      { label: "Frame", value: "Heavy Steel Tube Structure" },
      { label: "Control", value: "Cloud Automated Scheduling" },
    ],
    highlights: [
      "Skyline visibility across South Mumbai's financial flyover",
      "Low maintenance sealed modular architecture",
      "Turnkey civil and electrical commissioning",
      "Make In India certified assembly"
    ],
    nextProjectId: "model-town-jalandhar"
  },
  {
    id: "model-town-jalandhar",
    slug: "model-town-jalandhar",
    title: "Model Town Commercial DOOH",
    subtitle: "Regional High-Visibility DOOH Display in Punjab",
    client: "Punjab Regional Media Network",
    category: "Regional DOOH",
    vertical: "digital",
    location: "Model Town, Jalandhar, Punjab",
    city: "Jalandhar",
    state: "Punjab",
    completion: "Operational",
    scale: "Prime Commercial Market Intersection",
    heroImage: "/images/projects/proj-jalandhar.jpg",
    gallery: [
      "/images/projects/proj-jalandhar.jpg"
    ],
    description: "All-weather regional digital billboard deployment in Model Town, Jalandhar, capturing prime consumer footfall in one of Punjab's most affluent commercial shopping districts.",
    challenge: "Extreme North Indian winter fog followed by blistering summer heat with dense dust storms.",
    solution: "Specially sealed IP65 cabinets with high-contrast black face diodes that penetrate morning fog and maintain crisp legibility in blinding afternoon sun.",
    metrics: [
      { label: "Brightness", value: "6,500 Nits" },
      { label: "Footfall", value: "85,000 / Day" },
      { label: "Contrast", value: "4000:1" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pitch", value: "P4.8 Outdoor SMD" },
      { label: "Power Supply", value: "Meanwell CE Certified" },
      { label: "CMS", value: "JIO SOFTWARE Cloud Playout" },
    ],
    highlights: [
      "Dominant DOOH asset in premier regional retail market",
      "Automated cloud content scheduling with zero latency",
      "Robust thermal regulation for Punjab climate",
      "Backed by local field technical support"
    ],
    nextProjectId: "kolhapur-commercial-led"
  },
  {
    id: "kolhapur-commercial-led",
    slug: "kolhapur-commercial-led",
    title: "Kolhapur Commercial LED Wall",
    subtitle: "Urban Arterial Junction Commercial Display in Western Maharashtra",
    client: "Western Maharashtra Media Group",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Kolhapur, Maharashtra",
    city: "Kolhapur",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Major Urban Transit Circle",
    heroImage: "/images/projects/proj-kolhapur.jpg",
    gallery: [
      "/images/projects/proj-kolhapur.jpg"
    ],
    description: "High-footfall junction commercial advertising display in Kolhapur, delivering high-definition digital branding to regional commuters and retail shoppers.",
    challenge: "Heavy monsoon rainfall and power supply voltage irregularities in regional Tier-2 grid.",
    solution: "Integrated wide-voltage switch-mode power supplies (160V - 265V) with automatic surge isolation and hermetically sealed IP65 display modules.",
    metrics: [
      { label: "Voltage Tol.", value: "160V - 265V Auto" },
      { label: "Protection", value: "IP65 Waterproof" },
      { label: "Daily Reach", value: "95,000" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Display Pitch", value: "P4.0 Outdoor" },
      { label: "Refresh Rate", value: "3840Hz" },
      { label: "Enclosure", value: "Die-Cast Aluminum" },
    ],
    highlights: [
      "Resilient performance through heavy Western Ghats monsoon",
      "Wide-input power protection for regional electrical grids",
      "Dynamic multi-advertiser cloud scheduling",
      "Rapid local maintenance turnaround"
    ],
    nextProjectId: "noida-sector-77-led"
  },
  {
    id: "noida-sector-77-led",
    slug: "noida-sector-77-led",
    title: "Noida Sector-77 Commercial LED",
    subtitle: "High-Density Residential & Commercial Hub DOOH Billboard",
    client: "Delhi NCR Media Partners",
    category: "Commercial DOOH",
    vertical: "digital",
    location: "Noida Sector 77, Uttar Pradesh",
    city: "Noida",
    state: "Uttar Pradesh",
    completion: "Operational",
    scale: "High-Density Urban Expressway Corridor",
    heroImage: "/images/projects/proj-noida.jpg",
    gallery: [
      "/images/projects/proj-noida.jpg"
    ],
    description: "Large-scale DOOH billboard situated in the booming high-density residential and retail district of Sector 77, Noida, reaching young affluent professionals and families daily.",
    challenge: "Air quality particulate exposure and intense direct afternoon solar radiation.",
    solution: "Self-cleaning hydrophobic front mask coating, anti-dust positive pressure cooling, and auto-dimming optical sensors.",
    metrics: [
      { label: "Brightness", value: "7,000 Nits" },
      { label: "Impressions", value: "1,75,000 / Day" },
      { label: "Color Uniformity", value: ">98%" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P4.8 Outdoor LED" },
      { label: "Coating", value: "Hydrophobic Anti-Dust" },
      { label: "CMS", value: "Cloud Automated Network" },
    ],
    highlights: [
      "Strategic placement along major Noida arterial traffic corridor",
      "Low power consumption common cathode driver technology",
      "Centralized 256-bit encrypted content distribution",
      "ISO 9001:2015 certified manufacturing"
    ],
    nextProjectId: "t-nagar-chennai-display"
  },
  {
    id: "t-nagar-chennai-display",
    slug: "t-nagar-chennai-display",
    title: "T Nagar Commercial Display",
    subtitle: "High-Impact Retail DOOH Display in Chennai's Shopping Capital",
    client: "Chennai DOOH Advertising Consortium",
    category: "Retail DOOH",
    vertical: "digital",
    location: "T Nagar, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    completion: "Operational",
    scale: "India's Highest Revenue Retail Commercial Hub",
    heroImage: "/images/projects/proj-chennai-tnagar.jpg",
    gallery: [
      "/images/projects/proj-chennai-tnagar.jpg"
    ],
    description: "High-contrast commercial LED advertising display installed at the center of T Nagar, Chennai—reputed as India's premier high-volume retail shopping district.",
    challenge: "Extreme tropical humidity and salty coastal breeze requiring long-term anti-rust protection.",
    solution: "Electro-galvanized frame dipping with multi-stage polyurethane marine paint and IP66 hermetic sealing on all modules.",
    metrics: [
      { label: "Footfall Reach", value: "4,00,000 / Day" },
      { label: "Ingress", value: "IP66 Marine" },
      { label: "Luminance", value: "7,500 Nits" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pitch", value: "P4.0 Outdoor" },
      { label: "Refresh Rate", value: "3840Hz" },
      { label: "Viewing Angle", value: "160° / 140°" },
    ],
    highlights: [
      "Maximum footfall capture in Asia's largest retail shopping hub",
      "Vibrant high-color-depth digital playback",
      "Certified marine weather resistance",
      "Full cloud playout control on JIO SOFTWARE servers"
    ],
    nextProjectId: "sailani-transit-nasik"
  },
  {
    id: "sailani-transit-nasik",
    slug: "sailani-transit-nasik",
    title: "Sailani Bus Stop Transit LED",
    subtitle: "Public Transit Digital Information & Signage Network",
    client: "Municipal Transit Authority / Media Partner",
    category: "Public Transit Signage",
    vertical: "digital",
    location: "Sailani Transit Hub, Nasik, Maharashtra",
    city: "Nasik",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Major Public Transit Interchange",
    heroImage: "/images/projects/proj-nasik-transit.jpg",
    gallery: [
      "/images/projects/proj-nasik-transit.jpg"
    ],
    description: "Digital public passenger information display and transit advertising screen deployed at the bustling Sailani Bus Stop transit interchange in Nasik.",
    challenge: "High vehicle exhaust emissions, continuous diesel vibration, and vandalism risks in public transit zones.",
    solution: "Vandal-resistant polycarbonate protective face shield, heavy-duty anti-shock mounting dampers, and internal filtration to isolate exhaust particulate.",
    metrics: [
      { label: "Transit Commuters", value: "65,000 / Day" },
      { label: "Impact Resistance", value: "IK10 Rated" },
      { label: "Uptime", value: "99.9%" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P3.9 Outdoor" },
      { label: "Protection", value: "IP65 & IK10 Vandal-Proof" },
      { label: "Brightness", value: "6,000 Nits" },
    ],
    highlights: [
      "Continuous public messaging and commercial advertising integration",
      "Engineered to withstand heavy urban transit vibration and diesel fumes",
      "Automated time-synchronized route schedules and civic announcements",
      "Installed and serviced by ACE SELECT regional Maharashtra engineers"
    ],
    nextProjectId: "caratlane-palladium-mall"
  },
  {
    id: "caratlane-palladium-mall",
    slug: "caratlane-palladium-mall",
    title: "CaratLane Flagship Retail Active LED",
    subtitle: "Ultra-Fine Pitch Indoor Active LED Showcase for Luxury Jewellery Flagship",
    client: "CaratLane / Titan Company",
    category: "Retail Active LED & Display Systems",
    vertical: "digital",
    location: "Palladium Mall, Lower Parel, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Premier Luxury Shopping Mall Storefront",
    heroImage: "/images/projects/proj-caratlane-palladium.jpg",
    gallery: [
      "/images/projects/proj-caratlane-palladium.jpg",
      "/images/projects/proj-viviana-mall.jpg"
    ],
    description: "Ultra-fine pitch indoor Active LED video display seamlessly integrated into custom luxury jewellery architectural millwork at CaratLane's flagship store in Palladium Mall, Mumbai. Designed to render diamonds and precious gems with true-to-life color fidelity and sparkling brilliance.",
    challenge: "Jewellery visual merchandising requires exceptionally high color rendering index (CRI > 95), zero flicker under mobile camera photography, and silent operation in an intimate luxury boutique.",
    solution: "Supplied and installed broadcast-grade fine pitch LED modules with high grayscale depth, non-reflective matte black SMD coating, and passive fanless cooling to preserve the serene acoustic ambiance of the store.",
    metrics: [
      { label: "Color Rendering", value: "CRI > 95" },
      { label: "Flicker Rating", value: "Camera Certified" },
      { label: "Acoustics", value: "0 dB Fanless" },
      { label: "Playout", value: "4K Cloud Sync" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P1.8 Fine Pitch High Refresh" },
      { label: "Refresh Rate", value: "3840Hz" },
      { label: "Bezel Design", value: "100% Seamless Frameless Mount" },
      { label: "Software CMS", value: "Cloud Automation on JIO Servers" },
    ],
    highlights: [
      "Flawless jewelry display with true-to-life diamond sparkle rendering",
      "Zero fan noise for serene luxury retail environment",
      "Dynamic in-store campaign synchronization from Titan corporate HQ",
      "Flawless night-time mall installation without retail disruption"
    ],
    nextProjectId: "hitachi-sbi-atm-network"
  },

  // 2. Banking & ATM Networks
  {
    id: "hitachi-sbi-atm-network",
    slug: "hitachi-sbi-atm-network",
    title: "Hitachi SBI ATM Network Rollout",
    subtitle: "Pan-India ATM Kiosk Fabrication, Architectural Cladding & Signage",
    client: "Hitachi Payment Services / State Bank of India",
    category: "Banking Infrastructure",
    vertical: "banking",
    location: "Burar, Chattarpur MP, Bilhari, Mukerian & Pan-India",
    city: "Pan-India (Over 340+ Hubs)",
    state: "National Deployment",
    completion: "Active Ongoing Rollout",
    scale: "340+ Locations Across Tier-1, Tier-2 & Rural Districts",
    heroImage: "/images/projects/proj-hitachi-atm.jpg",
    gallery: [
      "/images/projects/proj-hitachi-atm.jpg",
      "/images/projects/proj-atm-kiosks.jpg",
      "/images/projects/photo-p40-1.jpeg",
      "/images/projects/atm-kiosk-branding.jpg"
    ],
    description: "Nationwide end-to-end turnkey rollout of standardized SBI Hitachi ATM kiosks and banking lobbies across more than 340 locations in India. Scope encompasses complete structural steel frames, fire-retardant exterior ACP cladding, standardized high-intensity LED glow signage, directional totems, and digital surveillance branding.",
    challenge: "Managing simultaneous rapid-deployment fabrication, logistics, and on-ground civil installation across geographically dispersed locations ranging from high-density metro centers to remote rural districts.",
    solution: "Leveraged ACE SELECT's central manufacturing capacity (3,00,000 sq.ft./day printing and precision metal fabrication) combined with our nationwide logistics network spanning 586+ vendors across 476+ cities to deploy pre-fabricated modular kits.",
    metrics: [
      { label: "Locations Active", value: "340+ Sites" },
      { label: "Vendor Network", value: "586+ Vendors" },
      { label: "Cities Covered", value: "476+ Cities" },
      { label: "Quality Audit", value: "100% ISO Signoff" },
    ],
    specs: [
      { label: "Cladding Material", value: "4mm Fire-Retardant Aluminum Composite Panel" },
      { label: "Signage Illumination", value: "Energy-Saving IP67 Samsung LED Modules" },
      { label: "Print Technology", value: "High-Resolution UV & Eco-Solvent Printing" },
      { label: "Structural Frame", value: "Powder Coated Modular Steel Architecture" },
      { label: "Signage Warranty", value: "5 Years Fade & Lum-Loss Guarantee" },
    ],
    highlights: [
      "Standardized national visual identity execution across 340+ sites",
      "Night-time deployments to prevent ATM downtime",
      "Geo-tagged digital photographic audit dossiers per branch",
      "Continuous on-ground maintenance support via 36/40 in-house engineers"
    ],
    nextProjectId: "sbi-ncr-atm-kiosks"
  },
  {
    id: "sbi-ncr-atm-kiosks",
    slug: "sbi-ncr-atm-kiosks",
    title: "SBI NCR ATM Kiosks Network",
    subtitle: "Standardized ATM Cube Totems & Exterior Signage in North India",
    client: "State Bank of India / NCR Network",
    category: "ATM Infrastructure & Branding",
    vertical: "banking",
    location: "Dogra Complex, Mukerian & Punjab",
    city: "Multiple Hubs",
    state: "Punjab & North India",
    completion: "Operational",
    scale: "Regional Kiosk Cluster Deployment",
    heroImage: "/images/projects/proj-atm-kiosks.jpg",
    gallery: [
      "/images/projects/proj-atm-kiosks.jpg",
      "/images/projects/proj-hitachi-atm.jpg"
    ],
    description: "Standardized visual branding overhaul, ATM cube totems, directional wayfinding, and corporate exterior weatherproofing across the Dogra Complex and Punjab regional banking corridors.",
    challenge: "Extreme weather exposure and variable local shop-front dimensions requiring adaptive modular cladding.",
    solution: "Designed adaptive modular ACP frame sections with precision laser cut branding and high-lumen IP67 LED backlighting.",
    metrics: [
      { label: "Kiosks Deployed", value: "45+ Sites" },
      { label: "Illumination", value: "High-Lumen 6500K" },
      { label: "Warranty", value: "5 Years" },
      { label: "Audit Rating", value: "100%" },
    ],
    specs: [
      { label: "Material", value: "Alloy 3003 ACP & 3D Acrylic" },
      { label: "LED Modules", value: "Epistar IP67 Sealed" },
      { label: "Coating", value: "Anti-Graffiti Vinyl Over-Laminate" },
    ],
    highlights: [
      "Consistent brand recognition across Tier-2 and Tier-3 banking centers",
      "Low maintenance long-life LED electrical architecture",
      "Complete civil, electrical, and structural installation",
      "Delivered ahead of agreed rollout timeline"
    ],
    nextProjectId: "sbi-branch-signage"
  },
  {
    id: "sbi-branch-signage",
    slug: "sbi-branch-signage",
    title: "State Bank of India Branch Signage",
    subtitle: "Pan-India External & Internal Signage for Nationalized Banking Network",
    client: "State Bank of India",
    category: "Banking Infrastructure",
    vertical: "banking",
    location: "Over 476+ Cities Pan-India",
    city: "Nationwide",
    state: "All 28 States & UTs",
    completion: "Active Pan-India Program",
    scale: "Hundreds of Main & Regional Branches",
    heroImage: "/images/projects/proj-sbi-branch-network.jpg",
    gallery: [
      "/images/projects/proj-sbi-branch-network.jpg",
      "/images/projects/proj-bank-signage.jpg",
      "/images/projects/proj-bank-signage-facade.jpg"
    ],
    description: "Turnkey visual identity implementation and exterior glow signage fabrication for State Bank of India branches across India. Encompassing massive main fascia signs, 3D acrylic channel lettering, directional wayfinding totems, and internal visual branding.",
    challenge: "Ensuring exact Pantone and chromatic color accuracy, consistent illumination levels, and structural safety sign-offs across diverse building facades across Tier-1, Tier-2, and Tier-3 cities.",
    solution: "Batch-produced modular lightboxes and CNC cut channel letters manufactured in-house under strict ISO 9001:2015 quality controls, ensuring 100% color fidelity and uniform lighting diffusion.",
    metrics: [
      { label: "Cities Reached", value: "476+ Cities" },
      { label: "Color Standard", value: "Exact SBI Pantone" },
      { label: "Warranty", value: "5 Years" },
      { label: "LED Life", value: "50,000+ Hrs" },
    ],
    specs: [
      { label: "Fascia Build", value: "Extruded Aluminum & High-Impact Polycarbonate" },
      { label: "Internal Drivers", value: "Industrial Meanwell CE/UL Certified" },
      { label: "Lettering", value: "Vacuum Formed & Cast Acrylic 3D Letters" },
      { label: "Compliance", value: "Electrical Safety & Fire-Retardant Certified" },
    ],
    highlights: [
      "Complete design-to-build branch exterior transformation",
      "Standardized quality control across urban and remote rural branches",
      "Rapid turnaround time leveraging central 3 Lakh sq.ft./day capacity",
      "Full compliance with central bank safety guidelines"
    ],
    nextProjectId: "atm-kiosk-cladding-totems"
  },
  {
    id: "atm-kiosk-cladding-totems",
    slug: "atm-kiosk-cladding-totems",
    title: "ATM Kiosk Cladding & Static Totems",
    subtitle: "Heavy-Duty Modular Kiosk Fabrication and Directional Totems",
    client: "National Banking Consortium",
    category: "Banking Infrastructure",
    vertical: "banking",
    location: "Pan-India Tier-1, Tier-2 & Rural Hubs",
    city: "Pan-India",
    state: "National Grid",
    completion: "Active Ongoing",
    scale: "Pan-India Multi-State Network",
    heroImage: "/images/projects/proj-atm-kiosks-panindia.jpg",
    gallery: [
      "/images/projects/proj-atm-kiosks-panindia.jpg",
      "/images/projects/proj-atm-kiosks.jpg"
    ],
    description: "Factory-cured structural metal fabrication, anti-corrosive powder coating, and weather-resistant external cladding for bank ATM booths and offsite e-lobbies nationwide.",
    challenge: "Extreme outdoor weathering, high pedestrian abrasion, and remote site logistics.",
    solution: "Heavy-gauge galvanized steel frame with automotive grade polyurethane finishes and tamper-proof fasteners.",
    metrics: [
      { label: "Corrosion Class", value: "C4 Industrial" },
      { label: "Warranty", value: "5 Years" },
      { label: "Assembly Time", value: "6 Hours / Kiosk" },
      { label: "Vendor Reach", value: "586+ Partners" },
    ],
    specs: [
      { label: "Framing", value: "Structural Box Section Steel" },
      { label: "Panels", value: "4mm PVDF Coated ACP" },
      { label: "Illumination", value: "Edge-lit Optical Acrylic Panels" },
    ],
    highlights: [
      "Modular pre-assembled kits for lightning-fast site erection",
      "Engineered for high resistance against rain, dust, and rust",
      "Standardized compliance with national banking security mandates",
      "Dedicated field teams in 476+ cities"
    ],
    nextProjectId: "national-bank-branch-facades"
  },
  {
    id: "national-bank-branch-facades",
    slug: "national-bank-branch-facades",
    title: "National Bank Branch Facades",
    subtitle: "Turnkey Branch Facade Modernization & Pylon Totems",
    client: "Public Sector Banking Partners",
    category: "Turnkey Banking Architecture",
    vertical: "banking",
    location: "Pan-India Branch Network",
    city: "Multiple Cities",
    state: "Pan-India",
    completion: "Operational",
    scale: "Major Urban & Regional Branches",
    heroImage: "/images/projects/proj-bank-signage-facade.jpg",
    gallery: [
      "/images/projects/proj-bank-signage-facade.jpg",
      "/images/projects/proj-bank-signage.jpg"
    ],
    description: "Turnkey branch fascia replacement, wayfinding pylons, and architectural entrance portals for nationalized banks seeking modern, accessible customer touchpoints.",
    challenge: "Executing architectural facade replacements on aging heritage buildings without disrupting daily customer branch traffic.",
    solution: "Non-intrusive sub-frame anchors, lightweight aluminum composite skins, and pre-wired modular electrical harnesses deployed overnight.",
    metrics: [
      { label: "Energy Savings", value: "40% LED" },
      { label: "Fire Rating", value: "Class A FR" },
      { label: "Wind Rating", value: "140 km/h" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Substructure", value: "High-Tensile Aluminum Extrusions" },
      { label: "Lighting", value: "High-Efficiency IP67 LED Modules" },
      { label: "Certification", value: "ISO 9001:2015 Approved" },
    ],
    highlights: [
      "Modernized banking entrance experiences across hundreds of branches",
      "Strict compliance with corporate identity guidelines",
      "Turnkey civil, architectural, and electrical sign-off",
      "Built with Make in India certified materials"
    ],
    nextProjectId: "axis-house-headquarters"
  },
  {
    id: "axis-house-headquarters",
    slug: "axis-house-headquarters",
    title: "Axis House Corporate Headquarters",
    subtitle: "Bespoke Corporate Headquarters Signage & Directional Wayfinding",
    client: "Corporate Banking Directorate",
    category: "Corporate Signage & Visual Architecture",
    vertical: "banking",
    location: "Worli, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "Flagship Corporate Headquarters Campus",
    heroImage: "/images/projects/proj-bank-signage.jpg",
    gallery: [
      "/images/projects/proj-bank-signage.jpg"
    ],
    description: "Bespoke corporate architectural signage, executive boardroom wayfinding, illuminated campus totems, and visual brand features for a premier corporate banking headquarters in Mumbai.",
    challenge: "Ultra-high aesthetic standards required by executive leadership, demanding immaculate edge finishes, seamless backlighting, and hidden mechanical fasteners.",
    solution: "Precision laser-cut brushed stainless steel (SS 304), high-index optical acrylic diffusion, and dimmable DALI-controlled LED backlighting.",
    metrics: [
      { label: "Finish Quality", value: "Architectural SS 304" },
      { label: "Lighting Control", value: "DALI Dimmable" },
      { label: "Design Life", value: "15+ Years" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Metal", value: "Grade 304 Brushed Stainless Steel" },
      { label: "Acrylic", value: "Cast Optical Grade 15mm" },
      { label: "LED CRI", value: ">90 True Color" },
    ],
    highlights: [
      "Award-winning corporate identity architectural execution",
      "Seamless integration with contemporary corporate interior finishes",
      "Delivered with zero snags on opening day",
      "Long-term facilities maintenance contract"
    ],
    nextProjectId: "retail-visual-merchandising"
  },

  // 3. Pan-India Signage & Branding
  {
    id: "retail-visual-merchandising",
    slug: "retail-visual-merchandising",
    title: "Retail Visual Merchandising Network",
    subtitle: "High-Volume Large-Format Graphics & High-Street Storefronts",
    client: "National Retail Brands Network",
    category: "Retail Branding & Signage",
    vertical: "branding",
    location: "Pan-India High Streets & Malls",
    city: "Pan-India (476+ Cities)",
    state: "All Major States",
    completion: "Active Ongoing",
    scale: "High-Volume Multi-Store Campaigns",
    heroImage: "/images/projects/proj-retail-signage-panindia.jpg",
    gallery: [
      "/images/projects/proj-retail-signage-panindia.jpg",
      "/images/projects/proj-commercial-facades.jpg"
    ],
    description: "High-volume visual merchandising rollouts, large-format UV backlit graphics, in-store fabric lightboxes, and promotional signage across hundreds of retail stores simultaneously.",
    challenge: "Synchronizing same-day promotional campaign launches across hundreds of cities nationwide with zero color deviation.",
    solution: "Centralized mass production on Vutek 8-colour UV and Epson 60610 print lines with automated color spectrophotometer calibration, backed by our 586+ vendor logistics grid.",
    metrics: [
      { label: "Print Capacity", value: "3 Lakh sq.ft./day" },
      { label: "Cities Reached", value: "476+ Cities" },
      { label: "Color Match", value: "ΔE < 1.5 Precision" },
      { label: "Turnaround", value: "48-Hour SLA" },
    ],
    specs: [
      { label: "Printers", value: "EFI Vutek 8-Colour & Epson 60610" },
      { label: "Inks", value: "Eco-Solvent & UV Curable Inks" },
      { label: "Substrates", value: "Fabric, Backlit Vinyl, Foam Board, Acrylic" },
    ],
    highlights: [
      "Industry-leading 3 Lakh sq. ft. per day print output",
      "Nationwide synchronized rollout capability",
      "Vibrant photorealistic resolution up to 1000 DPI",
      "Complete post-installation photo audit report"
    ],
    nextProjectId: "corporate-hq-signage"
  },
  {
    id: "corporate-hq-signage",
    slug: "corporate-hq-signage",
    title: "Corporate Headquarters Signage",
    subtitle: "Architectural Wayfinding Pylons and Illuminated Campus Totems",
    client: "Multi-Sector Corporate Campuses",
    category: "Corporate Wayfinding & Pylons",
    vertical: "branding",
    location: "Metro Financial Districts Across India",
    city: "Mumbai, Delhi, Bengaluru, Hyderabad",
    state: "Multi-State",
    completion: "Operational",
    scale: "Large Multi-Building Corporate Parks",
    heroImage: "/images/projects/proj-corporate-signage.jpg",
    gallery: [
      "/images/projects/proj-corporate-signage.jpg"
    ],
    description: "Design and fabrication of architectural campus wayfinding pylons, vehicular directional monuments, and building entry monumentation for Fortune 500 corporate campuses across India.",
    challenge: "Ensuring long-term outdoor durability, night-time legibility, and architectural harmony with modern glass-facade business parks.",
    solution: "Heavy-gauge structural steel cores with anodized architectural aluminum skins and CNC precision-milled edge-lit typography.",
    metrics: [
      { label: "Monument Height", value: "Up to 8 Meters" },
      { label: "Wind Rating", value: "150 km/h" },
      { label: "Warranty", value: "5 Years" },
      { label: "ISO Audit", value: "ISO 9001 Certified" },
    ],
    specs: [
      { label: "Core", value: "Heavy Galvanized Steel Pylon" },
      { label: "Fascia", value: "Brushed Aluminum Composite & Acrylic" },
      { label: "Lighting", value: "Internal Low-Voltage LED Matrix" },
    ],
    highlights: [
      "Enhances campus identity and visitor traffic navigation",
      "Built to endure torrential monsoons and high summer heat",
      "Turnkey structural civil foundations and electrical feeds",
      "Manufactured in-house with zero outsourcing"
    ],
    nextProjectId: "commercial-facade-branding"
  },
  {
    id: "commercial-facade-branding",
    slug: "commercial-facade-branding",
    title: "Commercial Facade Branding",
    subtitle: "Architectural Cladding & High-Impact External Signage",
    client: "Commercial Real Estate Developers",
    category: "Commercial Architecture",
    vertical: "branding",
    location: "Pan-India Commercial Hubs",
    city: "Major Metros",
    state: "Pan-India",
    completion: "Operational",
    scale: "High-Rise Commercial Buildings",
    heroImage: "/images/projects/proj-commercial-facades.jpg",
    gallery: [
      "/images/projects/proj-commercial-facades.jpg"
    ],
    description: "Full exterior building facade transformations utilizing high-grade architectural ACP cladding, structural curtain wall trims, integrated LED neon accents, and dimensional brand letters.",
    challenge: "Elevated high-rise installations requiring specialized rope-access and crane logistics with strict municipal safety approvals.",
    solution: "Deploying certified structural engineers and safety-compliant rigging crews operating under ISO 45001:2018 occupational safety standards.",
    metrics: [
      { label: "Safety Record", value: "Zero Incidents" },
      { label: "Material Class", value: "Fire Retardant FR" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Cladding", value: "4mm PVDF Fire-Retardant ACP" },
      { label: "Structure", value: "Extruded 6063-T6 Aluminum Rails" },
      { label: "Sealing", value: "Weatherproof Structural Silicone" },
    ],
    highlights: [
      "Turnkey design-to-build exterior building modernizations",
      "100% adherence to national building fire safety codes",
      "Rapid execution minimizing commercial tenant disruptions",
      "Backed by comprehensive 5-year commercial warranty"
    ],
    nextProjectId: "ghatkopar-high-street-signage"
  },
  {
    id: "ghatkopar-high-street-signage",
    slug: "ghatkopar-high-street-signage",
    title: "Ghatkopar High-Street Signage & LED",
    subtitle: "Integrated Commercial Signage and Front-Service Active LED",
    client: "Ghatkopar Commercial Retailers",
    category: "Commercial Retail Branding",
    vertical: "branding",
    location: "Ghatkopar, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Operational",
    scale: "High-Footfall Retail Frontage",
    heroImage: "/images/projects/proj-ghatkopar-mumbai.jpg",
    gallery: [
      "/images/projects/proj-ghatkopar-mumbai.jpg"
    ],
    description: "Integrated high-street commercial signage and front-service Active LED video display installed on a premier commercial facade in Ghatkopar, Mumbai.",
    challenge: "Extremely tight sidewalk space requiring 100% front-serviceable display modules with zero rear access requirements.",
    solution: "Engineered ultra-slim magnetic front-access LED cabinets coupled with durable ACP weather surrounds and illuminated channel lettering.",
    metrics: [
      { label: "Cabinet Depth", value: "Only 80mm" },
      { label: "Service Access", value: "100% Front" },
      { label: "Brightness", value: "6,500 Nits" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Pixel Pitch", value: "P3.9 Outdoor" },
      { label: "Service Tool", value: "Vacuum Magnetic Front Extraction" },
      { label: "CMS", value: "JIO SOFTWARE Cloud Playout" },
    ],
    highlights: [
      "Ultra-compact footprint suitable for dense urban storefronts",
      "Combines dynamic digital video with static 3D glow signage",
      "Flawless day/night visibility with automated dimming",
      "Installed overnight without street disruption"
    ],
    nextProjectId: "viviana-mall-pc-chandra"
  },
  {
    id: "viviana-mall-pc-chandra",
    slug: "viviana-mall-pc-chandra",
    title: "Viviana Mall & PC Chandra Displays",
    subtitle: "Luxury Mall Experiences and High-End Retail Facades",
    client: "Viviana Mall / PC Chandra Jewellers",
    category: "Retail Mall Experiences",
    vertical: "branding",
    location: "Thane, Mumbai & Kolkata",
    city: "Thane & Kolkata",
    state: "Maharashtra & West Bengal",
    completion: "Operational",
    scale: "Premier Shopping Malls & Flagship Stores",
    heroImage: "/images/projects/proj-viviana-mall.jpg",
    gallery: [
      "/images/projects/proj-viviana-mall.jpg"
    ],
    description: "High-elegance digital signage totems, luxury in-store video walls, and custom storefront architectural branding at Viviana Mall in Thane and PC Chandra flagship boutiques in Kolkata.",
    challenge: "Matching ultra-luxury architectural guidelines with impeccable finishing and silent electronics.",
    solution: "Bespoke brass and champagne gold anodized trims, borderless fine pitch LED displays, and high CRI lighting.",
    metrics: [
      { label: "Finish Quality", value: "Champagne Gold" },
      { label: "Display Pitch", value: "P1.8 Fine Pitch" },
      { label: "Acoustics", value: "Silent 0 dB" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "LED Type", value: "Black Face SMD High Contrast" },
      { label: "Trim", value: "Precision CNC Aluminum & Brass" },
      { label: "Refresh Rate", value: "3840Hz" },
    ],
    highlights: [
      "Elevates luxury brand equity in premier retail environments",
      "Impeccable jewel-like craftsmanship",
      "Automated cloud content scheduling from central HQ",
      "Full warranty and maintenance coverage"
    ],
    nextProjectId: "bkc-executive-elobby-turnkey"
  },

  // 4. Turnkey Design-to-Build & Exhibitions
  {
    id: "bkc-executive-elobby-turnkey",
    slug: "bkc-executive-elobby-turnkey",
    title: "BKC Executive E-Lobby & Experience Center",
    subtitle: "Turnkey Design-to-Build Spatial Architecture & Commercial Fit-Out",
    client: "Nationalized Banking Institution",
    category: "Design-to-Build Fit-Out",
    vertical: "turnkey",
    location: "Bandra-Kurla Complex, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    completion: "Completed",
    scale: "Flagship Corporate Banking Branch & Executive Atrium",
    heroImage: "/images/projects/proj-bkc-elobby.jpg",
    gallery: [
      "/images/projects/proj-bkc-elobby.jpg",
      "/images/projects/photo-p21-0.jpeg",
      "/images/projects/photo-p21-1.jpeg",
      "/images/projects/photo-p21-3.jpeg"
    ],
    description: "Comprehensive design-to-build turnkey transformation of an executive corporate banking facility in BKC, Mumbai. Scope encompassed structural interior reconfiguration, custom acoustic woodwork, fine-pitch Active LED video walls, smart automated lighting, and secure digital banking infrastructure.",
    challenge: "Managing end-to-end multi-disciplinary trades (civil, MEP, acoustics, video walls, digital kiosks) under one unified governance framework.",
    solution: "Leveraged ACE SELECT's full in-house capabilities—from architectural design and factory millwork to electronics assembly—eliminating sub-contractor delays and ensuring flawless delivery.",
    metrics: [
      { label: "Turnkey Scope", value: "Concept to Commission" },
      { label: "Annual Scale", value: "₹100 Cr+ Division" },
      { label: "Timeframe", value: "60 Days" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Video Wall", value: "P1.5 Seamless Active LED" },
      { label: "Joinery", value: "In-House Factory Precision Woodwork" },
      { label: "Acoustics", value: "Class A Acoustic Baffles" },
    ],
    highlights: [
      "Single-source turnkey accountability under one roof",
      "Flawless blend of digital technology and interior craftsmanship",
      "Delivered within strict financial sector regulatory standards",
      "Proven capability for ₹100 Cr+ annual turnkey operations"
    ],
    nextProjectId: "nationwide-exhibition-pavilions"
  },
  {
    id: "nationwide-exhibition-pavilions",
    slug: "nationwide-exhibition-pavilions",
    title: "Nationwide Exhibition Pavilions & Trade Shows",
    subtitle: "Custom Modular Structural Pavilions & Dynamic LED Backdrops",
    client: "Corporate & Government Exhibition Directorate",
    category: "Exhibition Design & Build",
    vertical: "turnkey",
    location: "Pan-India Convention Centers",
    city: "New Delhi, Mumbai, Bengaluru, Hyderabad",
    state: "Pan-India",
    completion: "Multi-Event Program",
    scale: "Large-Scale Trade Show Pavilions Up to 1,000 m²",
    heroImage: "/images/projects/proj-exhibition-panindia.jpg",
    gallery: [
      "/images/projects/proj-exhibition-panindia.jpg",
      "/images/projects/proj-exhibition.jpg"
    ],
    description: "Turnkey design, heavy fabrication, transport, and rapid on-site erection of custom exhibition pavilions, interactive experience stalls, and dynamic Active LED display stages across India's premier convention centers.",
    challenge: "Aggressive 48-hour on-site setup windows with complex two-story modular mezzanine structures and multi-screen video integration.",
    solution: "Pre-fabricated modular structural frames and quick-lock rental/fixed LED cabinets tested in-factory before rapid site deployment.",
    metrics: [
      { label: "Booth Sizes", value: "Up to 1,000 m²" },
      { label: "Setup Window", value: "48 Hours" },
      { label: "Safety Rating", value: "100% Certified" },
      { label: "Cities", value: "Major Metros" },
    ],
    specs: [
      { label: "Structure", value: "Modular Heavy Aluminum Trussing" },
      { label: "Display", value: "High-Definition Curved & Flat LED Walls" },
      { label: "Finishes", value: "High-Gloss Lacquered Wood & Metal" },
    ],
    highlights: [
      "Turnkey concept, 3D visualization, build, and event operations",
      "Stunning dynamic LED backdrop integrations",
      "Rapid teardown and zero material waste logistics",
      "Award-winning stall designs recognized by industry juries"
    ],
    nextProjectId: "turnkey-commercial-workplace"
  },
  {
    id: "turnkey-commercial-workplace",
    slug: "turnkey-commercial-workplace",
    title: "Turnkey Commercial Workplace Construction",
    subtitle: "Comprehensive Design-to-Build Corporate Interior Environments",
    client: "Corporate Enterprise Partners",
    category: "Commercial Interiors & Fit-Out",
    vertical: "turnkey",
    location: "476+ Cities Pan-India",
    city: "Pan-India",
    state: "National Grid",
    completion: "Active Turnkey Operations",
    scale: "Full-Floor Executive Workplaces & Branch Modernizations",
    heroImage: "/images/projects/proj-turnkey-commercial.jpg",
    gallery: [
      "/images/projects/proj-turnkey-commercial.jpg",
      "/images/projects/proj-bkc-elobby.jpg"
    ],
    description: "Full-service commercial construction, interior spatial planning, MEP installation, modular workstations, executive boardrooms, and dynamic digital brand architecture across India.",
    challenge: "Navigating regional vendor variations and localized building bylaws while maintaining absolute consistency in craftsmanship.",
    solution: "Centralized project governance under Founder Mr. Kamal Gor's leadership, supported by 36/40 in-house engineers and nationwide field logistics.",
    metrics: [
      { label: "Annual Scale", value: "₹100 Cr+ Scale" },
      { label: "City Reach", value: "476+ Cities" },
      { label: "Engineers", value: "36 In-House" },
      { label: "Warranty", value: "5 Years" },
    ],
    specs: [
      { label: "Delivery", value: "Complete Design-to-Build Under One Roof" },
      { label: "Quality Code", value: "ISO 9001:2015 & ISO 45001:2018" },
      { label: "Scope", value: "Civil, MEP, Joinery, Acoustic, AV & Technology" },
    ],
    highlights: [
      "Transforms abstract corporate concepts into elegant, functional spaces",
      "Backed by ₹100 Crore+ annual operational capacity",
      "Strict environmental responsibility and sustainable material sourcing",
      "Timely handover guaranteed with rigorous quality assurance"
    ],
    nextProjectId: "custom-pavilions-brand-activations"
  },
  {
    id: "custom-pavilions-brand-activations",
    slug: "custom-pavilions-brand-activations",
    title: "Custom Pavilions & Brand Activations",
    subtitle: "Experiential Brand Architecture & Interactive Digital Kiosks",
    client: "National Brand Activation Network",
    category: "Experiential Build & AV",
    vertical: "turnkey",
    location: "Major Metro Exhibition Venues",
    city: "Metro Cities Pan-India",
    state: "Multi-State",
    completion: "Active Program",
    scale: "High-Impact Commercial Activations",
    heroImage: "/images/projects/proj-exhibition.jpg",
    gallery: [
      "/images/projects/proj-exhibition.jpg",
      "/images/projects/proj-exhibition-panindia.jpg"
    ],
    description: "Heavy fabrication and rapid-deployment experiential brand booths, interactive digital kiosks, spatial brand activations, and custom architectural pavilions for leading consumer and corporate brands.",
    challenge: "High-stress multi-city event calendars demanding flawless mechanical, electrical, and interactive AV performance.",
    solution: "Dedicated event engineering strike-teams and prefabricated modular staging components manufactured in our central workshop facility.",
    metrics: [
      { label: "Activation Events", value: "50+ Annually" },
      { label: "Interactivity", value: "Touch & Motion Sensors" },
      { label: "Reliability", value: "100% On-Time" },
    ],
    specs: [
      { label: "Fabrication", value: "In-House Metal & Wood CNC Machining" },
      { label: "Displays", value: "Interactive Touch & Active LED" },
      { label: "Logistics", value: "Pan-India Dedicated Fleet" },
    ],
    highlights: [
      "Engaging consumer brand interactions with cutting-edge visual tech",
      "Rapid deployment across any convention or outdoor venue in India",
      "Complete electrical, audio, and video synchronization",
      "Full post-event teardown and reverse logistics"
    ],
    nextProjectId: "kashi-vishwanath-temple"
  }
];

export function getProjectById(id: string): ProjectDetail | undefined {
  const normalizedId = id.toLowerCase().trim();
  return projectDetails.find(
    (p) =>
      p.id.toLowerCase() === normalizedId ||
      p.slug.toLowerCase() === normalizedId ||
      p.title.toLowerCase().replace(/[^a-z0-9]/g, "").includes(normalizedId.replace(/[^a-z0-9]/g, ""))
  );
}

export function getAllProjectIds(): string[] {
  return projectDetails.map((p) => p.id);
}
