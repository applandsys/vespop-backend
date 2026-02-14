module.exports = {
  apps: [
    {
      name: 'omninext',
      script: './index.js',
      watch: true, // Enable watch mode
      watch_delay: 1000, // Optional: Delay between restarts (in ms)
    }
  ]
};
