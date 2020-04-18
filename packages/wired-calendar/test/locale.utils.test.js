import { expect } from '@open-wc/testing';

import { localizedMonths, localizedDays, getLocaleFromNavigator } from '../lib/locale.utils';

describe('locale-util localizedMonths', () => {
    it('should output 12 months', () => {
        expect(localizedMonths().length).to.equal(12);
    });

    it('should output english months by default', () => {
        const expected = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        expect(localizedMonths()).to.eql(expected);
    });

    it('should output french months when locale is fr-FR', () => {
        const expected = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
        expect(localizedMonths('fr-FR')).to.eql(expected);
    });

    it('should output short months when variant is short', () => {
        const expected = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        expect(localizedMonths('en-US', 'short')).to.eql(expected);
    });
});

describe('locale-util localizedDays', () => {
    it('should output 7 days', () => {
        expect(localizedDays().length).to.equal(7);
    });

    it('should output english days by default', () => {
        const expected = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        expect(localizedDays()).to.eql(expected);
    });

    it('should output french days when locale is fr-FR', () => {
        const expected = ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."];
        expect(localizedDays('fr-FR')).to.eql(expected);
    });
});

describe('locale-util getLocaleFromNavigator', () => {

    it('should return en-US if navigator has no locale', () => {
        const navigator = {};
        expect(getLocaleFromNavigator(navigator)).to.equal('en-US');
    });
    
    it('should return first of languages if navigator has no locale', () => {
        const navigator = {languages: ['fr-FR', 'en-US']}
        expect(getLocaleFromNavigator(navigator)).to.equal('fr-FR');
    });
    
    it('should return browserLanguage if set', () => {
        const navigator = {browserLanguage: 'ru-RU', languages: ['fr-FR', 'en-US']}
        expect(getLocaleFromNavigator(navigator)).to.equal('ru-RU');
    });
    
    it('should return systemLanguage if set', () => {
        const navigator = {systemLanguage: 'es-MX', browserLanguage: 'ru-RU', languages: ['fr-FR', 'en-US']}
        expect(getLocaleFromNavigator(navigator)).to.equal('es-MX');
    });

});
