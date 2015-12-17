# Is Ad-Blocking Ethical?

All modern day browsers have multiple plugins that are capable of blocking advertisements,
however, are they ethical in doing so?

## Why people use an adblocker

### Privacy
   
Many people use adblockers because they are deeply concerned about their online privacy.
When a browser makes a connection to a website, it sends a variety of information called
'headers'. These pieces of information are sent on every web page request to whatever server
the request is sent to. In addition, servers can set a value on the web browser with a key,
also known as a cookie. You can read more about cookies [here](http://www.allaboutcookies.org/cookies/).
There are popular browser extensions that exist that can read off the cookies stored for a
particular website. For Chrome, I personally prefer
[EditThisCookie](http://www.editthiscookie.com/), and [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
contains tools to edit and view cookies.

Using a sample website in which I developed and know what information is stored, I viewed what
cookies my website was storing. The website contains a log in, along with a remember me cookie.
Using the cookies, the application is able to authenticate between clients, and determine
what broswer is authenticated.

![Cookie information for a basic panel](https://s3.amazonaws.com/f.cl.ly/items/3o062S3q3D3Y0w271A2c/Image%202015-11-22%20at%207.00.49%20PM.png?t=1448236986499)

Within the screenshot, you can see 2 cookies in particular that are provided by my application:
the `connect.sid` cookie, as well as the `remember_me` cookie. These store random strings
that are stored in a database for later recall to know which broswer is which. Advertising
networks use cookies in a similar way to track users.

Using the header information, as well as cookies, the server is able to figure out which
person is viewing which web pages. The EFF (Electronic Frontier Foundation) has a free
website showing users how unique their browsers are. You can test the service at
[panopticlick.eff.org](https://panopticlick.eff.org).

With the information, advertisement networks are able to track who you are.

### Performance

Not displaying parts of a web page will speed up loading times significantly. Each advertising element requires a separate
HTTP request to a separate server, slowing down the loading time for a page. The New York Times recently did a study entitled
[The Cost of Mobile Ads on 50 News Websites](http://www.nytimes.com/interactive/2015/10/01/business/cost-of-mobile-ads.html)
which compared loading times of websites across the internet. Each of these websites had a a varying degree of advertisements
and baseline content hosted on the site, which made the loading time vary. In some instances, the advertising took over
__3x__ as long to load the advertisements than it did to load the actual web page.

Along with loading time speed, if a web page has enough extra elements, the internet browser will start to slow down in general,
especially in the case of overuse of video ads. This impedes the user experience.

Using an adblocker can actually result in the end computer doing less computations, as well as using less memory per page load.
[uBlock Origin](https://github.com/gorhill/uBlock), creation of Github user [gorhill](https://github.com/gorhill), is a cross
browser http firewall as described by the author, however is commonly used as an ad-blocker (and efficiently so). gorhill
reports great memory improvements ([diagram here](https://github.com/gorhill/uBlock#memory)), allowing for a user to do
more things with their computer or browser. Extra memory comes in handy especially when running an un-holy amount of tabs:

![Too many tabs](https://s3.amazonaws.com/f.cl.ly/items/0h2u2O0Z3N0C0J2l0P06/E7MYoDXxP.jpg?t=1448688776342)

When running many tabs (even a seemingly unrealistic scenario such as above), performance is key to maintaining a responsive
and productive browsing environment.

### Annoyance

Advertisements are annoying. Many people who use the internet on a normal basis are used
to advertisements clouding the actual experience. Viewing [nytimes.com](http://www.nytimes.com)
on November 22nd, 2015, I retrieved two screenshots: one with my ad-blocker disabled, and one
with it enabled.

![Ad-blocker disabled](https://s3.amazonaws.com/f.cl.ly/items/0T1E0e131q3h1S2I0z3X/Image%202015-11-22%20at%207.14.09%20PM.png)

__Without ad-blocking software enabled__

![Ad-blocker enabled](https://s3.amazonaws.com/f.cl.ly/items/3V0C1p190k1o2h2c1t1f/Image%202015-11-22%20at%207.15.25%20PM.png)

__With ad-blocking software enabled__

It becomes immediately evident that with an adblocker, the website is much more viewable, less
annoying, and cleaner in general. The advertisements get in the way, obstruct views, and overall
seem quite over the top. The original page had 4 sizable advertisements, taking up almost 1/3 of
the page.

A particularly comical website is [Ling's Cars](http://lingscars.com). The website, a legitimate car leasing site,
is a perfect example of obtrusive, yet effective advertising.The website is extemely popular, and perfectly describes
why advertisements can be annoying.


### Security

As it turns out, advertisements can be used easily to infect unsuspecting computers, only requiring the users to load 
advertisements carefully crafted by attackers without the knowledge of users. Thus, if users load the advertisement,
their machine will become infected due to exploitations in their browsers. Malwarebytes reported a specific incident
in August 2015, citing when hackers used [MSN.com's ad network to distribute their malware.](https://blog.malwarebytes.org/malvertising-2/2015/08/angler-exploit-kit-strikes-on-msn-com-via-malvertising-campaign/)

### People just don't want advertisements

Why would anyone want to actually view advertisements? They are --for the most part -- unwanted. [Dave Winer](http://davewiner.com/)
has a adequite, short blog post concerning this matter, titled [Advertising is Unwanted](http://scripting.com/2015/09/19/advertisingIsUnwanted.html).
Within his post, he explains concisely how the end user doesn't tolerate advertisements that don't
actively cater to their needs. If the advertisement doesn't help them with their lives, then
there is no reason they should be on the web page.

## Why, as a society, we need to view advertisements

If someone doesn't view the advertisement, then the website maintainer does not get the revenue from the visit. This can
compared to directly robbing the website of payment for your visit. It takes a substantial amount of time to create a website,
and also costs to register a domain name ([search for a few here](https://www.namecheap.com)), and buy a server to host
the content (providers vary).

While not a direct comparison, `ibj.io` is my personal domain name. This includes the server I rent monthly for a fixed
rate, as well as a SSL certificate. Below is a table of hosting costs for a VERY small website (such as ibj.io, which is
used mostly for internal purposes).

Item | Link | Cost per Month (USD 11/2015) | Cost per Year (2015)
-----|------|------------------------------|--------------
Hosting | [OVH](https://www.ovh.com/us/vps/vps-ssd.xml) | $6.99 | $83.88
Domain Name | [Namecheap (imadomain.io)](https://www.namecheap.com/domains/registration/results.aspx?domain=imadomain.io) | $2.74 | $32.88
SSL Certificate | [Comodo PostitiveSSL](https://www.namecheap.com/security/ssl-certificates/comodo/positivessl.aspx) | $0.75 | $9.00
Total | N\A | $10.48 | $125.76

Note, this is for a very basic non revenue gaining server. If someone received significant traffic that a small server like
`ibj.io` wasn't able to keep up with, hosting costs could become hundreds if not thousands of dollars per month. These are
all raw costs, and do not factor into time spent on developing content for a website.

For example, [The NY Times](http://www.nytimes.com) must hire writers and editors to actively produce content to put on
their website. If they didn't have content producers, then there would be no reason for the website to exist. When users
do not allow advertisements on the website, they actively block any revenue from going back to the website to maintain
itself.

[PageFair](https://pagefair.com), an independent advertising company specializing in subverting ad-blockers, compiles a yearly
assessment of the use and effects of adblocking in the web today. The reports, found on the company's [press page](https://pagefair.com/press_kit/),
reveal that adblocking is more and more becoming an issue. The [2015 report](http://downloads.pagefair.com/reports/2015_report-the_cost_of_ad_blocking.pdf)
indicated that there was a __41%__ increase in ad-block usage. The statistic was increased when iOS 9 introduced an app
API to allow for developers to create Adblockers for iOS's native web broswer, Safari. 


### Golden rule

Take the above chart, listing the monthly hosting costs for my personal virtual server, ibj.io. This server is capable of
serving web content, however is (at the time of this writing), being used as an internal test server. If I was a web developer
making all of my money off of a website, and I do not have any goods that I am capable of selling (example - if I only were 
to have a free service, or if only a content site), would not be economically advantageous to run a website under these principals.
If the website isn't making revenue, or is incapable of even covering hosting, then what is keeping it online? If everyone
had adblockers enabled on Google, the world's primary search engine, how would Google be able to support the crushing amount
of requests daily?

Creating a website isn't easy, and maintaining said website takes even more time and money than creation. If people are
robbing the website of its compensation, can one really think it is fair?

### We can't all be Wikipedia

If you weren't already aware, [Wikipedia](https://www.wikipedia.org/) is completely paid by donations from various users. Being a nonprofit, the website
does not collect donations for revenue, and the content on the site is almost completely user created. Even with no content
related costs, server hosting alone is great enough to a degree that it requires donations. The [Wikipedia Foundation Budget
Plan](https://upload.wikimedia.org/wikipedia/foundation/e/e0/2014-15_Wikimedia_Foundation_Plan.pdf)
for 2014-2015 called for almost $7.7M. While this doesn't seem much to the scale of Wikipedia's demand, it is a large
amount for a website that is not run by advertisements.

This model doesn't work for many websites, but Wikipedia's transparency provides some insight to the various scales of costs
required to run a successful website.

## Respectful Compromise

The balance between privacy, performance, security, as well as annoyance, and giving websites the credit that they deserve,
can be easily managed by each individual. Individuals, using the correct ad blocking software, can whitelist websites to
allow advertisements to be used. In this way, the user can support the websites they choose, while still blocking
advertisements that are intrusive, or have other unattractive qualities to them.

If users allow some advertisements that do not annoy them through, then advertisers will strive to produce advertisements that
are deemed by users to be acceptable. In the past, advertisements have been annoying, however, if the only condition
for a user viewing the advertisement is to be unobtrusive and acceptable, then eventually all advertisements will conform
to this image.

## Acceptable AdBlockers

At the time of this writing (late 2015), there are multiple ad-blockers available for
download for Chrome, Firefox, Internet Explorer, Safari, iOS Safari, Chrome for Android,
and Firefox for Android. The list below was picked out of the open pool of adblockers,
chosen using the guidelines listed within the next paragraph.

### Acceptability of AdBlockers

A proper ad-blocker must be set up in a manner that allows the user to properly block advertisements, while giving users
the ability to whitelist or blacklist sites from showing advertisements. This allows the user to support websites they feel
worthy, while still blocking other websites. I have found that uBlock Origin (gorhill's uBlock), as well as the fork by
[chrisaljoudi](https://github.com/chrisaljoudi) to fill these qualifications better than other ad-blockers available.

#### Eyeo (Ad Block Plus)

Ad Block Plus has a practice of 'acceptable advertising'. The idea of acceptable advertising is that companies can submit
advertisements to Eyeo with an administrative fee for the advertisement to be approved as unobtrusive, and not be blocked
by their ad blocking plugins. The issue comes into play when dealing with the idea of the internet. The internet is a
decentralized body with no single administrative body controlling any single part of the internet. Eyeo, by taking acceptable
advertising into their own jurisdiction along with the administrative fee can be viewed as abusive on the internet, going against
one of the core tenants of how the internet operates. This acceptable advertising can be turned off, however the simple
practice should be discouraged from use.

[eyeo](https://eyeo.com) lists this 'acceptable advertising' service [here](https://eyeo.com/en/services).

### Picks Per Browser Based on Acceptability

Personally advised, I use [gorhill](https://github.com/gorhill)'s [uBlock Origin](https://github.com/gorhill/uBlock) plugin for
Chrome. I also recommend the following for other browsers based on performance as well as development responsibility.

Browser | Ad Blocker
--------|-------------
Chrome | [uBlock Origin](https://github.com/gorhill/uBlock)
Firefox | [uBlock Origin](https://github.com/gorhill/uBlock)
Internet Explorer | None*
Safari | [uBlock*](https://github.com/chrisaljoudi/uBlock)
Opera | [uBlock](https://github.com/chrisaljoudi/uBlock)
iOS | [1Blocker](https://1blocker.com/)

`none`: The only ad-blocker I could find for Internet Explorer is eyeo's Ad Block Plus. The issues with Ad Block Plus are
described [above](#eyeo-ad-block-plus-).

`Safari`: uBlock, as of October 2015 is no longer supporting Safari, since the API which uBlock used had become deprecated
(end of life). There are other solutions, however I have not had adequite time to review them. The conversation regarding
this can be found [here](https://github.com/chrisaljoudi/uBlock/issues/1544#issuecomment-150397875).

## General Resources

A compiled list of sources used to create this page:
+   [Cookies](http://www.allaboutcookies.org/cookies/)
+   [EditThisCookie](http://www.editthiscookie.com/)
+   [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
+   [Browser Uniqueness Utility (EFF)](https://panopticlick.eff.org)
+   [The Cost of Mobile Ads on 50 News Websites](http://www.nytimes.com/interactive/2015/10/01/business/cost-of-mobile-ads.html)
+   [uBlock Origin](https://github.com/gorhill/uBlock)
+   [Ling's Cars](http://lingscars.com)
+   [Advertising is Unwanted](http://scripting.com/2015/09/19/advertisingIsUnwanted.html)
+   [Pagefair's 2015 AdBlocking Report](http://downloads.pagefair.com/reports/2015_report-the_cost_of_ad_blocking.pdf)
+   [Wikipedia Foundation Budget Plan 2014-2015](https://upload.wikimedia.org/wikipedia/foundation/e/e0/2014-15_Wikimedia_Foundation_Plan.pdf)
+   [Security Now's Coverage of Ad Blocking](https://www.grc.com/sn/sn-523-notes.pdf)