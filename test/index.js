'use strict';

var Polyglot = require('../');
var expect = require('chai').expect;

describe('transformPhrase', function () {
  var simple = '__name__ is __attribute__';
  var english = '__smartCount__ Name |||| __smartCount__ Names';
  var arabic = [
    'ولا صوت',
    'صوت واحد',
    'صوتان',
    '__smartCount__ أصوات',
    '__smartCount__ صوت',
    '__smartCount__ صوت'
  ].join(' |||| ');

  it('does simple interpolation', function () {
    expect(Polyglot.transformPhrase(simple, { name: 'Polyglot', attribute: 'awesome' })).to.equal('Polyglot is awesome');
  });

  it('removes missing keys', function () {
    expect(Polyglot.transformPhrase(simple, { name: 'Polyglot' })).to.equal('Polyglot is __attribute__');
  });

  it('selects the correct plural form based on smartCount', function () {
    expect(Polyglot.transformPhrase(english, { smartCount: 0 }, 'en')).to.equal('0 Names');
    expect(Polyglot.transformPhrase(english, { smartCount: 1 }, 'en')).to.equal('1 Name');
    expect(Polyglot.transformPhrase(english, { smartCount: 2 }, 'en')).to.equal('2 Names');
    expect(Polyglot.transformPhrase(english, { smartCount: 3 }, 'en')).to.equal('3 Names');
  });

  it('selects the correct locale', function () {
    // French rule: "0" is singular
    expect(Polyglot.transformPhrase(english, { smartCount: 0 }, 'fr')).to.equal('0 Name');
    expect(Polyglot.transformPhrase(english, { smartCount: 1 }, 'fr')).to.equal('1 Name');
    expect(Polyglot.transformPhrase(english, { smartCount: 2 }, 'fr')).to.equal('2 Names');
    expect(Polyglot.transformPhrase(english, { smartCount: 3 }, 'fr')).to.equal('3 Names');

    // Arabic has 6 rules
    expect(Polyglot.transformPhrase(arabic, 0, 'ar')).to.equal('ولا صوت');
    expect(Polyglot.transformPhrase(arabic, 1, 'ar')).to.equal('صوت واحد');
    expect(Polyglot.transformPhrase(arabic, 2, 'ar')).to.equal('صوتان');
    expect(Polyglot.transformPhrase(arabic, 3, 'ar')).to.equal('3 أصوات');
    expect(Polyglot.transformPhrase(arabic, 11, 'ar')).to.equal('11 صوت');
    expect(Polyglot.transformPhrase(arabic, 102, 'ar')).to.equal('102 صوت');
  });

  it('defaults to `en`', function () {
    // French rule: "0" is singular
    expect(Polyglot.transformPhrase(english, { smartCount: 0 })).to.equal('0 Names');
  });

  it('ignores a region subtag when choosing a pluralization rule', function () {
    // French rule: "0" is singular
    expect(Polyglot.transformPhrase(english, { smartCount: 0 }, 'fr-FR')).to.equal('0 Name');
  });

  it('works without arguments', function () {
    expect(Polyglot.transformPhrase(english)).to.equal(english);
  });

  it('respects a number as shortcut for smartCount', function () {
    expect(Polyglot.transformPhrase(english, 0, 'en')).to.equal('0 Names');
    expect(Polyglot.transformPhrase(english, 1, 'en')).to.equal('1 Name');
    expect(Polyglot.transformPhrase(english, 5, 'en')).to.equal('5 Names');
  });

  it('throws without sane phrase string', function () {
    expect(function () { Polyglot.transformPhrase(); }).to.throw(TypeError);
    expect(function () { Polyglot.transformPhrase(null); }).to.throw(TypeError);
    expect(function () { Polyglot.transformPhrase(32); }).to.throw(TypeError);
    expect(function () { Polyglot.transformPhrase({}); }).to.throw(TypeError);
  });
});
