(() => {
    const test = () => {
      console.log();
    }
    const init = () => {
      test();
    }

    document.addEventListener('DOMContentLoaded', () => {
      init();
    });
  })()