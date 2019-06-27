import { drumListElements } from './base';

export const renderDrumIndicators = (shouldPlay) => {
    drumListElements.indicators.forEach(indicator => {
        const drumName = indicator.closest('.drum').dataset.name;
        if (shouldPlay[drumName]) {
            indicator.classList.add('indicator-on');

            setTimeout(() => {
                indicator.classList.remove('indicator-on');
            }, 100);
        }
    });
};

export const flashIndicator = drumName => {
    const indicator = drumListElements.indicators[drumName];

    indicator.classList.add('indicator-on');
    setTimeout(() => {
        indicator.classList.remove('indicator-on');
    }, 100)
};