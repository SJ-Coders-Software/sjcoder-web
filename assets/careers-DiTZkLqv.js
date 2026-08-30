import{n as e,t}from"./common-BSgecZ2H.js";var n=[{title:`Software Development Intern (Healthcare AI)`,status:`Hiring Now`,duration:`6 Months`,stipend:`Unpaid Internship`,tags:[`React.js`,`Java`,`Python`,`Django`,`REST APIs`,`AI & Healthcare Integrations`],whoCanApply:[`Freshers with a Computer Science background (graduates or final-year students)`,`Passionate about coding and learning new technologies`,`Basic knowledge of React, Java, Python, or web development`,`Eager to work on real-world healthcare products`],whatYouGet:[`Hands-on experience on real-world healthcare and AI projects`,`Mentorship from experienced developers`,`Internship Certificate and Experience Letter on successful completion`,`Opportunity for a full-time Software Developer role based on performance`],applyEmail:`info@sjcoders.com`,applySubject:`Application – Software Development Intern`},{title:`Software Testing Intern (Manual & Automation)`,status:`Hiring Now`,duration:`6 Months`,stipend:`Unpaid Internship`,tags:[`Manual Testing`,`Automation Testing`,`Selenium`,`API Testing`,`Postman`,`Test Case Design`],whoCanApply:[`Freshers with a Computer Science background (graduates or final-year students)`,`Interested in software quality, testing, and attention to detail`,`Basic understanding of manual testing concepts (SDLC/STLC, test cases, bug reporting)`,`Familiarity with or willingness to learn automation tools like Selenium and Postman`,`Eager to work on real-world healthcare products`],whatYouGet:[`Hands-on experience testing real-world healthcare and AI projects`,`Mentorship from experienced QA and development engineers`,`Exposure to both manual and automation testing workflows`,`Internship Certificate and Experience Letter on successful completion`,`Opportunity for a full-time QA Engineer role based on performance`],applyEmail:`info@sjcoders.com`,applySubject:`Application – Software Testing Intern`}];function r(e){let t=`Dear SJ Coders Team,

I would like to apply for the ${e.title} position.

A little about myself:
[Share your background, relevant skills, and why you're a good fit]

I have attached my resume for your reference.

Regards,
[Your Name]
[Phone Number]`,n=`mailto:${e.applyEmail}?subject=${encodeURIComponent(e.applySubject)}&body=${encodeURIComponent(t)}`;return`
    <details class="job-card glass-card reveal">
      <summary class="job-summary">
        <div class="job-summary-info">
          <span class="job-badge">${e.status}</span>
          <h3>${e.title}</h3>
          <div class="job-meta">
            <span class="job-meta-item"><i data-lucide="clock"></i>${e.duration}</span>
            <span class="job-meta-item"><i data-lucide="indian-rupee"></i>${e.stipend}</span>
          </div>
        </div>
        <i data-lucide="chevron-down" class="job-chevron"></i>
      </summary>
      <div class="job-body">
        <div class="job-tags">
          ${e.tags.map(e=>`<span class="tag">${e}</span>`).join(``)}
        </div>
        <div class="job-details">
          <div>
            <h4><i data-lucide="user-check"></i> Who Can Apply?</h4>
            <ul>${e.whoCanApply.map(e=>`<li>${e}</li>`).join(``)}</ul>
          </div>
          <div>
            <h4><i data-lucide="gift"></i> What You'll Get</h4>
            <ul>${e.whatYouGet.map(e=>`<li>${e}</li>`).join(``)}</ul>
          </div>
        </div>
        <div class="job-apply">
          <a href="${n}" class="btn btn-primary">Apply Now <i data-lucide="send"></i></a>
          <p><i data-lucide="mail"></i> Or email your resume to <a href="mailto:${e.applyEmail}">${e.applyEmail}</a>
            with subject "${e.applySubject}"</p>
        </div>
      </div>
    </details>
  `}function i(){let e=document.getElementById(`jobsList`);e&&(e.innerHTML=n.length?n.map(r).join(``):`<div class="no-openings glass-card reveal">No open positions right now — check back soon, or send your
        resume to <a href="mailto:info@sjcoders.com">info@sjcoders.com</a> and we'll reach out when a role opens up.</div>`,window.lucide&&lucide.createIcons())}document.addEventListener(`DOMContentLoaded`,()=>{t(),i(),e()});