"""
Seed data for the Skill table, drawn from the real O*NET Content Model
skills taxonomy (https://www.onetonline.org/skills/), which is public
domain (U.S. Dept. of Labor / O*NET). O*NET IDs below are the official
element IDs from the "Skills" section of the O*NET Content Model.

This is a representative subset (the "Basic Skills" and "Cross-Functional
Skills" families) — enough to map informal youth/student activities onto
real labor-market skill categories instead of invented labels. For
production, pull the full skills.csv from the O*NET database
(https://www.onetcenter.org/database.html) and load it wholesale, or
swap this module for a Lightcast Open Skills API client if you have a
Lightcast license (LIGHTCAST_MODE below sketches that integration point).

Each row: (onet_id, name, category)
"""

ONET_SKILLS = [
    # Basic Skills — Content
    ("2.A.1.a", "Reading Comprehension", "Basic Skills"),
    ("2.A.1.b", "Active Listening", "Basic Skills"),
    ("2.A.1.c", "Writing", "Basic Skills"),
    ("2.A.1.d", "Speaking", "Basic Skills"),

    # Basic Skills — Process
    ("2.A.2.a", "Critical Thinking", "Basic Skills"),
    ("2.A.2.b", "Active Learning", "Basic Skills"),
    ("2.A.2.d", "Monitoring", "Basic Skills"),

    # Social Skills
    ("2.B.1.a", "Social Perceptiveness", "Social Skills"),
    ("2.B.1.b", "Coordination", "Social Skills"),
    ("2.B.1.c", "Persuasion", "Social Skills"),
    ("2.B.1.d", "Negotiation", "Social Skills"),
    ("2.B.1.e", "Instructing", "Social Skills"),
    ("2.B.1.f", "Service Orientation", "Social Skills"),

    # Complex Problem Solving
    ("2.B.2.i", "Complex Problem Solving", "Complex Problem Solving Skills"),

    # Technical Skills
    ("2.B.3.a", "Operations Analysis", "Technical Skills"),
    ("2.B.3.b", "Technology Design", "Technical Skills"),
    ("2.B.3.d", "Programming", "Technical Skills"),
    ("2.B.3.j", "Quality Control Analysis", "Technical Skills"),
    ("2.B.3.k", "Troubleshooting", "Technical Skills"),

    # Systems Skills
    ("2.B.4.e", "Judgment and Decision Making", "Systems Skills"),
    ("2.B.4.g", "Systems Analysis", "Systems Skills"),
    ("2.B.4.h", "Systems Evaluation", "Systems Skills"),

    # Resource Management Skills
    ("2.B.5.a", "Time Management", "Resource Management Skills"),
    ("2.B.5.b", "Management of Financial Resources", "Resource Management Skills"),
    ("2.B.5.c", "Management of Material Resources", "Resource Management Skills"),
    ("2.B.5.d", "Management of Personnel Resources", "Resource Management Skills"),
]

# Category-to-skill-IDs mapping used as a *starting hint* for the AI parser —
# the AI still has to ground its choice in the user's actual evidence, but this
# narrows the candidate list to plausible O*NET skills for that activity type
# rather than letting the model pick from all 35 freely.
CATEGORY_SKILL_HINTS = {
    "CODING": ["2.B.3.d", "2.B.2.i", "2.B.3.k", "2.B.4.g"],
    "ART": ["2.A.1.d", "2.B.1.a", "2.B.5.a"],
    "SPORTS": ["2.B.1.b", "2.B.5.d", "2.B.1.e"],
    "COMMUNITIES": ["2.B.1.b", "2.B.1.d", "2.B.5.d", "2.B.1.f"],
    "BUSINESS": ["2.B.5.b", "2.B.1.c", "2.B.1.f", "2.B.5.a"],
    "VOLUNTEERING": ["2.B.1.f", "2.B.5.a", "2.A.2.b"],
    "CONTENT": ["2.A.1.c", "2.B.3.b", "2.B.5.a"],
    "ROBOTICS": ["2.B.3.d", "2.B.3.a", "2.B.2.i", "2.B.4.g"],
    "GAMING": ["2.B.4.e", "2.B.1.b", "2.B.2.i"],
    "TEACHING": ["2.B.1.e", "2.B.1.a", "2.A.1.b"],
    "OTHER": ["2.A.2.a", "2.B.5.a", "2.A.2.b"],
}


def seed_skills(db_session):
    """Idempotently insert the O*NET skill rows into the database."""
    from .models import Skill

    existing = {s.onet_id for s in db_session.query(Skill.onet_id).all()}
    for onet_id, name, category in ONET_SKILLS:
        if onet_id not in existing:
            db_session.add(Skill(onet_id=onet_id, name=name, category=category, source="ONET"))
    db_session.commit()


# --- Lightcast integration sketch (alternative to O*NET) -------------------
# If you have a Lightcast Open Skills API key, replace `seed_skills` with a
# fetch against https://skills.emsidata.com/skills and store their skill IDs
# instead of O*NET element IDs. The rest of the app (Experience <-> Skill
# many-to-many, resume rendering) works unchanged since it only depends on
# `Skill.onet_id` / `Skill.name` existing, not on which taxonomy they came from.
