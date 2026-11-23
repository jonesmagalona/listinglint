# Reflection: ListingLint

Christopher Jones Mante Magalona · AIM Graded Mini Project 4.2

ListingLint is a web application that checks used-equipment listings before publication. A reviewer pastes listing text, including Taglish, and an LLM extracts the make, model, year, operating hours, price, and location. Rules written in code then check for missing information, implausible values, unusual prices, and possible duplicates. I chose this problem based on approximately 10 years of QA experience, where incomplete and inconsistent listing information creates additional review work.

I used Claude as an engineering and writing partner to evaluate the idea against the project requirements, draft documentation, generate code and tests, and guide me through GitHub, VS Code, and Vercel. I also used Claude Code on my Mac to commit changes, push updates, and resolve issues. My responsibility was to define the problem, choose the validation rules, review the proposed changes, and check the results. This process reinforced that using AI still requires clear decisions and careful verification from me.

I requested Mac-specific instructions after the initial setup guide assumed Windows. I also moved the project out of iCloud Drive to prevent unnecessary syncing of dependency files. When the public README contained unfinished placeholders, I requested a clear project overview. Managing the project across several tools was challenging. Copying an older project version caused repeated setup work, and the first deployment began before the API key was configured. These experiences taught me to confirm the project version, file location, and deployment settings before proceeding.

My main technical learning was the value of separating AI extraction from validation decisions. The model interprets the listing text, while explicit rules determine its status. This made the validation logic testable through 37 unit tests. However, reliable rules still depend on correctly extracted information, so extraction accuracy remains an important limitation.

Live testing revealed a problem that the initial unit tests had missed. Off-topic text produced an AI-502 error because the model returned a null summary that the schema rejected. Structured server logs helped identify the cause. I corrected the handling of that response, added a regression test, and documented the change in the specification's revision history. This showed me why testing realistic inputs on the deployed application is an essential part of QA.

For a second version, I would introduce shared rate limiting and support bulk checking through CSV uploads, the feature my QA tester said a team would pay for. I would also create an evaluation set of at least 50 labelled listings to measure extraction accuracy whenever the model or prompt changes.

For responsible use, because the model can extract incorrect values, the application displays the extracted fields for inspection and keeps a person responsible for the publishing decision. Building ListingLint helped me connect my QA experience with AI application development and reinforced the importance of testing, traceability, and human review.
