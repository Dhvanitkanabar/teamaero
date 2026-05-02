/**
 * User mapping for the Vanguard AERO platform.
 * Maps GR Numbers (108601 - 108630) to Student Names, Roles, and Bios.
 */
export const USER_MAP = {
  108601: { name: 'Devanshi', role: 'admin', bio: 'Expert in system architecture and strategic operations. Leading the squadron to peak efficiency.', status: 'Active' },
  108602: { name: 'Zeel', role: 'member', bio: 'Frontend engineer specializing in interactive 3D interfaces and kinetic motion design.', status: 'Active' },
  108603: { name: 'Jaydip', role: 'member', bio: 'Backend developer focused on real-time data sync and robust socket communication.', status: 'Active' },
  108604: { name: 'Saptak', role: 'member', bio: 'UI/UX specialist with a passion for glassmorphic design and user-centric workflows.', status: 'Active' },
  108605: { name: 'Anshu', role: 'member', bio: 'Data analyst tracking community performance metrics and live engagement stats.', status: 'Active' },
  108606: { name: 'Hashit Pandya', role: 'member', bio: 'Full-stack developer building scalable features for the Vanguard ecosystem.', status: 'Active' },
  108607: { name: 'Vishwa B', role: 'member', bio: 'Creative developer blending technical precision with artistic interface concepts.', status: 'Active' },
  108608: { name: 'Kreya', role: 'member', bio: 'Focuses on accessibility and semantic HTML structure for optimal platform reach.', status: 'Active' },
  108609: { name: 'Vidhi', role: 'member', bio: 'Security specialist ensuring encrypted data flow and identity verification safety.', status: 'Active' },
  108610: { name: 'Priyansh', role: 'member', bio: 'Performance optimizer dedicated to minimizing latency and maximizing speed.', status: 'Active' },
  108611: { name: 'Dhruv', role: 'member', bio: 'DevOps engineer managing deployment pipelines and cloud infrastructure stability.', status: 'Active' },
  108612: { name: 'Dhvanit', role: 'member', bio: 'Mobile-first developer ensuring seamless responsiveness across all AERO devices.', status: 'Active' },
  108613: { name: 'Harshil', role: 'member', bio: 'Logic engineer implementing complex state management and Redux architectures.', status: 'Active' },
  108614: { name: 'Devisingh', role: 'member', bio: 'Testing specialist focused on high-density unit tests and integration reliability.', status: 'Active' },
  108615: { name: 'Raunak Sahu', role: 'member', bio: 'Visual designer crafting high-end iconography and technical assets.', status: 'Active' },
  108616: { name: 'Arpan', role: 'member', bio: 'Interaction designer focused on micro-animations and smooth user transitions.', status: 'Active' },
  108617: { name: 'Tapan', role: 'member', bio: 'Database architect optimizing query performance and relational data integrity.', status: 'Active' },
  108618: { name: 'Harshit Kumar', role: 'member', bio: 'API specialist building clean Axios abstractions and service layers.', status: 'Active' },
  108619: { name: 'Nishit', role: 'member', bio: 'Content strategist managing SEO metadata and semantic project documentation.', status: 'Active' },
  108620: { name: 'Rani', role: 'member', bio: 'Support engineer ensuring smooth onboarding for all squadron operators.', status: 'Active' },
  108621: { name: 'Chitt', role: 'member', bio: 'Algorithm developer implementing real-time ranking and leaderboard logic.', status: 'Active' },
  108622: { name: 'Nandini', role: 'member', bio: 'Accessibility lead ensuring the platform is inclusive and keyboard-navigable.', status: 'Active' },
  108623: { name: 'Drup', role: 'member', bio: 'Core contributor focused on modular component design and reusability.', status: 'Active' },
  108624: { name: 'Bhavya', role: 'member', bio: 'Integration specialist bridging frontend interactions with socket-driven events.', status: 'Active' },
  108625: { name: 'Parth', role: 'member', bio: 'Technical lead monitoring system health and operational uptime metrics.', status: 'Active' },
  108626: { name: 'Jilan', role: 'member', bio: 'Search engine specialist optimizing platform visibility and OG metadata.', status: 'Active' },
  108627: { name: 'Kahan', role: 'member', bio: 'State management expert refining Redux slices and persistent storage.', status: 'Active' },
  108628: { name: 'Smit', role: 'member', bio: 'Frontend architect building high-density dashboards and layouts.', status: 'Active' },
  108629: { name: 'Sachin', role: 'member', bio: 'Full-stack lead focusing on industry-ready code quality and standards.', status: 'Active' },
  108630: { name: 'Arjun', role: 'admin', bio: 'Chief Technical Admin. Overseeing platform development and squadron excellence.', status: 'Active' },
};

/**
 * Get user details by GR Number.
 */
export const getUserByGR = (grNumber) => {
  return USER_MAP[grNumber] || null;
};

/**
 * Get all members as a formatted array for the Members page.
 */
export const getAllMembers = () => {
  return Object.entries(USER_MAP).map(([id, data]) => ({
    id,
    accountId: `GR-${id}`,
    ...data,
    xp: Math.floor(Math.random() * 5000) + 1000,
    integrity: 95 + Math.floor(Math.random() * 5),
    image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}&backgroundColor=b6e3f4`,
  }));
};
