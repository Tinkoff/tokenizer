import { tokenizer } from './tokenizer';
const tokenizerTag = ([str]: TemplateStringsArray) => tokenizer(str);

const domain = ([value]: TemplateStringsArray) => ({ type: 'domain', value });
const text = ([value]: TemplateStringsArray) => ({ type: 'text', value });
const users = ([value]: TemplateStringsArray) => ({ type: 'users', value });
const tickers = ([value]: TemplateStringsArray) => ({ type: 'tickers', value });
const hash = ([value]: TemplateStringsArray) => ({ type: 'hash', value });
const email = ([value]: TemplateStringsArray) => ({ type: 'email', value });

describe('url parsing', () => {

  it('should handle lists',  () => {
    const list = `
          1.Apple 18.1%
          2.Microsoft 16.4%
          3.Facebook 6.2%
          4.Alphabet 4.8%
          5.Alphabet 4.8%
          6.Visa 3.5%
          7.Mastercard 2.8%
          8.Intel 2.7%
          9.Nvidia 2.5%
          10.Netflix 2.4%
    `;
    expect(tokenizer(list)[0]).toEqual({ type: 'text', value: list });
  });

  it('EXAMPLE.com capital', () => {
    expect(tokenizerTag`EXAMPLE.com`[0]).toEqual(domain`EXAMPLE.com`);
  });

  it('HTTPS://EXAMPLE.com capital', () => {
    expect(tokenizerTag`HTTPS://EXAMPLE.com capital`[0]).toEqual(domain`HTTPS://EXAMPLE.com`);
  });

  it('Держись веб HTTP://YA.RU', () => {
    expect(tokenizerTag`HTTP://YA.RU`[0]).toEqual(domain`HTTP://YA.RU`);
  });

  it('Доман с разным регистром букв', () => {
    expect(tokenizerTag`HttP://yA.RU`[0]).toEqual(domain`HttP://yA.RU`);
  });

  it('https://example.com', () => {
    expect(tokenizerTag`check out https://example.com`[1]).toEqual(domain`https://example.com`);
  });

  it('Https://example.com first capital letter', () => {
    expect(tokenizerTag`check out Https://example.com`[1]).toEqual(domain`Https://example.com`);
  });

  it('example.com', () => {
    expect(tokenizerTag`go to example.com`[1]).toEqual(domain`example.com`);
  });

  it('within brackets', () => {
    expect(tokenizerTag`go to (example.com)`[1]).toEqual(domain`example.com`);
  });
  describe('brackets', () => {
    it('simple', () => {
      expect(tokenizerTag`go to (example.com)`[1]).toEqual(domain`example.com`);
    });
    it('ends with dot', () => {
      expect(tokenizerTag`go to (example.com/ololo).`[1]).toEqual(domain`example.com/ololo`);
    });
    it('two brackets', () => {
      expect(tokenizerTag`go to (example.com/ololo))`[1]).toEqual(domain`example.com/ololo`);
    });
    it('complex url', () => {
      expect(tokenizerTag`go to (example.com/ololo?foo=bar/#hash.this[one=two])`[1]).toEqual(domain`example.com/ololo?foo=bar/#hash.this[one=two]`);
    });
  })

  describe('dots', () => {
    it('simple', () => {
      expect(tokenizerTag`go to example.com.`[1]).toEqual(domain`example.com`);
    });
    it('with path', () => {
      expect(tokenizerTag`go to (example.com/ololo.`[1]).toEqual(domain`example.com/ololo`);
    });
    it('with path and space', () => {
      expect(tokenizerTag`go to (example.com/ololo. `[1]).toEqual(domain`example.com/ololo`);
    });
    it('dots within path', () => {
      expect(tokenizerTag`go to (example.com/ololo...ololo/`[1]).toEqual(domain`example.com/ololo...ololo/`);
    });

    it('dots after brackets', () => {
      expect(tokenizerTag`go to (example.com/ololo). `[1]).toEqual(domain`example.com/ololo`);
    });

    it('dots after query', () => {
      expect(tokenizerTag`go to (example.com/ololo?foo=bar.`[1]).toEqual(domain`example.com/ololo?foo=bar`);
    });
  });


  it('ends with slash', () => {
    expect(tokenizerTag`+https://smart-lab.ru/ `[1]).toEqual(domain`https://smart-lab.ru/`);
  });

  it('тинькофф.рф', () => {
    expect(tokenizerTag`патриотичный тинькофф.рф`[1]).toEqual(domain`тинькофф.рф`);
  });

  it('ascii representation of cyrillic site', () => {
    expect(tokenizerTag`https://xn--80aqcujdeaf9k.xn--p1ai/тестодин  посмотрим как`[0]).toEqual(
      domain`https://xn--80aqcujdeaf9k.xn--p1ai/тестодин`
    );
  });

  it('with hash tags', () => {
    expect(tokenizerTag`spa routing example.com#/some.cool?hash. Sure`[1]).toEqual(
      domain`example.com#/some.cool?hash`
    );
  });

  it('starts with -', () => {
    expect(tokenizerTag`-www.dohod.ru/ik/analytics/dividend/`[1]).toEqual(
      domain`www.dohod.ru/ik/analytics/dividend/`
    );
  });

  it('starts with emoji', () => {
    expect(tokenizerTag`📍www.dohod.ru/ik/analytics/dividend/`[1]).toEqual(
      domain`www.dohod.ru/ik/analytics/dividend/`
    );
  });

  it('uses "-" a lot', () => {
    expect(tokenizerTag`www-stage.some-cool--domain.ru/?param-with-dash=value`[0]).toEqual(
      domain`www-stage.some-cool--domain.ru/?param-with-dash=value`
    );
  });

  it('has mail in hash', () => {
    expect(tokenizerTag`exapmle.com/?user=my@mail.ru`[0]).toEqual(
      domain`exapmle.com/?user=my@mail.ru`
    );
  });
});
describe('email', () => {
  it('simple email', function () {
    expect(tokenizerTag`email me at my@mail.ru! Hit me a msg`[1]).toEqual(email`my@mail.ru`);
  });
  it('email with dots and dashes', function () {
    expect(
      tokenizerTag`i've created my.new-email-for.work@mail.co.uk. Send some work stuff there`[1]
    ).toEqual(email`my.new-email-for.work@mail.co.uk`);
  });
  it('cyrillic mail', function () {
    expect(tokenizerTag`i've created моя.почта@яндекс.рф. Send some work stuff there`[1]).toEqual(
      email`моя.почта@яндекс.рф`
    );
  });
});

describe('integration', () => {
  it('should parse big text', function () {
    const result = tokenizerTag`
    ❗Существует множество полезных ресурсов для фундаментального и технического анализа (как бесплатных, так и платных). Ниже привожу некоторые из них, которыми пользуюсь сам.

📍 https://ru.tradingview.com  - самый удобный сервис для технического анализа, полноценная работа с графиками.
📍https://ru.investing.com-котировки, всесторонняя информация по эмитентам, финансовая сводка.
📍 https://bigcapital.org- бесплатный ресурс для анализа фундаментала компаний РФ, вся базовая информация по эмитентам, мультипликаторы, финансовые показатели, динамика долгов и собственного капитала. По акциям второго-третьего эшелона ({$TTLK} , {$TRMK} , {$CNTL} ) не всегда отображается полноценная информация.
📍 https://simplywall.st  - наглядный анализ фундаментальных показателей компаний. Удобная инфографика позволяет быстро оценить здоровье и перспективы эмитента. Отображается инсайдерская активность. В основном, я пользуюсь этим ресурсом. Также сервис позволяет вести учет личного портфеля. Полноценная версия платная(10$ в месяц), но можно пользоваться бесплатным триалом.
📍 https://finviz.com - скринер иностранных акций, поиск компаний по заданным параметрам и рекомендациям аналитиков. Например, можно отфильтровать по капитализации от 10 млрд USD :  {$ABBV} , {$KEY} , {$VRTX} или с див. доходностью более 7% в USD: {$ET} , {$MO} , {$MBT} и т.д.
📍www.dohod.ru/ik/analytics/dividend/ - информация по дивидендам российских эмитентов, прогнозы по дивам, также показывает индекс DSI (индекс стабильности дивидендных выплат). Чем ближе DSI к 1, тем лучше - это значит, что дивы выплачивались и повышались 7 лет подряд, а значит высока вероятность, что их не порежут.  Если 0,3 < DSI <0,6 - компания выплачивает дивы нерегулярно. Для примера, у {$TATNP} этот показатель 0.86, {$SNGSP} - 0.71 , {$BSPB} - 0.57.
📍https://conomy.ru - удобный сайт для анализа финансовой отчетности российских компаний (РСБУ и МФСО), много полезной информации. Анализируя поквартальную прибыль и накапливающийся итог, учитывая дивидендную политику компании, мы можем прогнозировать будущую дивидендную доходность по итогам года.
📍https://smart-lab.ru/ - крупнейший русскоязычный ресурс по работе с фондовым рынком РФ, много полезных статей.

Продолжение... ⬇️
    `;
    const domains = result.filter((x) => x.type === 'domain').map((x) => x.value);
    expect(domains).toEqual([
      'https://ru.tradingview.com',
      'https://ru.investing.com',
      'https://bigcapital.org',
      'https://simplywall.st',
      'https://finviz.com',
      'www.dohod.ru/ik/analytics/dividend/',
      'https://conomy.ru',
      'https://smart-lab.ru/',
    ]);
    result;
  });

  it('complex test', () => {
    const str = 'sdf dsf #ONE dfsd https://vk.com яндекс.рф. создатель канала в инстаграм @ADS.fond';
    const result = tokenizer(str, {
      tickers: /\$ticker/,
      users: /@[\w\.]+/,
      hash: /#one/i,
    });

    expect(result).toEqual([
      text`sdf dsf `,
      hash`#ONE`,
      text` dfsd `,
      domain`https://vk.com`,
      text` `,
      domain`яндекс.рф`,
      text`. создатель канала в инстаграм `,
      users`@ADS.fond`,
    ]);
  });

  it('complex test', () => {
    const str = 'sdf dsf #ONE dfsd https://vk.com яндекс.рф. @user sdf #one $ticker dsf';
    const result = tokenizer(str, {
      tickers: /\$ticker/,
      users: /@user/,
      hash: /#one/i,
    });

    expect(result).toEqual([
      text`sdf dsf `,
      hash`#ONE`,
      text` dfsd `,
      domain`https://vk.com`,
      text` `,
      domain`яндекс.рф`,
      text`. `,
      users`@user`,
      text` sdf `,
      hash`#one`,
      text` `,
      tickers`$ticker`,
      text` dsf`,
    ]);
  });

  it('should handle intersection', function () {
    const str = 'sdf dsf dfsd https://vk.com#one яндекс.рф. @user sdf #one $ticker dsf';
    const result = tokenizer(str, {
      hash: /#one/i,
    });

    expect(result).toEqual([
      text`sdf dsf dfsd `,
      domain`https://vk.com#one`,
      text` `,
      domain`яндекс.рф`,
      text`. @user sdf `,
      hash`#one`,
      text` $ticker dsf`,
    ]);
  });

  it('should omit empty tokens regexp', function () {
    const str = 'sdf dsf #one dfsd https://vk.com яндекс.рф. @user sdf #one $ticker dsf';
    const result = tokenizer(str, {
      tickers: '',
      users: '',
      hash: '',
    });

    expect(result).toEqual([
      text`sdf dsf #one dfsd `,
      domain`https://vk.com`,
      text` `,
      domain`яндекс.рф`,
      text`. @user sdf #one $ticker dsf`,
    ]);
  });
});
