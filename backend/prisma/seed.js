"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding Visa Services CRM database...');
    // 1. Create Business Profile
    let business = await prisma.business.findFirst({
        where: { name: 'Go Source Placement Services' },
    });
    if (!business) {
        business = await prisma.business.create({
            data: {
                name: 'Go Source Placement Services',
                legalName: 'Go Source Placement Services Pvt. Ltd.',
                email: 'info@gosource.com',
                phone: '+92 51 1234567',
                timezone: 'Asia/Karachi',
                defaultCurrency: 'PKR',
                address: 'Blue Area, Islamabad, Pakistan',
            },
        });
        console.log(`Created business: ${business.name}`);
    }
    // 2. Roles
    const roles = ['Owner', 'Manager', 'Visa Consultant', 'Finance Officer'];
    for (const roleName of roles) {
        const existingRole = await prisma.role.findFirst({
            where: { businessId: business.id, name: roleName },
        });
        if (!existingRole) {
            await prisma.role.create({
                data: {
                    businessId: business.id,
                    name: roleName,
                    isSystem: true,
                },
            });
        }
    }
    // 3. Admin User
    const adminEmail = 'admin@gosource.com';
    let admin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    const ownerRole = await prisma.role.findFirst({
        where: { businessId: business.id, name: 'Owner' },
    });
    if (!admin) {
        const passwordHash = await bcrypt_1.default.hash('Admin@123', 10);
        admin = await prisma.user.create({
            data: {
                businessId: business.id,
                email: adminEmail,
                passwordHash,
                firstName: 'Mohsin',
                lastName: 'Admin',
                userRoles: ownerRole
                    ? {
                        create: {
                            roleId: ownerRole.id,
                        },
                    }
                    : undefined,
            },
        });
        console.log(`Created Admin user: ${admin.email} (Password: Admin@123)`);
    }
    // 4. Sample Countries & Visa Types
    const countriesData = [
        {
            name: 'United Arab Emirates',
            code: 'AE',
            visaTypes: ['30 Days Tourist', '60 Days Tourist', 'Job Seeker Visa', 'Investor Visa'],
        },
        {
            name: 'United Kingdom',
            code: 'GB',
            visaTypes: ['Standard Visitor Visa', 'Student Visa (Subclass Tier 4)', 'Skilled Worker Visa'],
        },
        {
            name: 'Canada',
            code: 'CA',
            visaTypes: ['Visitor Visa (TRV)', 'Study Permit', 'Express Entry'],
        },
        {
            name: 'Saudi Arabia',
            code: 'SA',
            visaTypes: ['Umrah Visa', 'Tourist E-Visa', 'Work Visit Visa'],
        },
    ];
    for (const c of countriesData) {
        let country = await prisma.country.findFirst({
            where: { businessId: business.id, code: c.code },
        });
        if (!country) {
            country = await prisma.country.create({
                data: {
                    businessId: business.id,
                    name: c.name,
                    code: c.code,
                },
            });
        }
        for (const vtName of c.visaTypes) {
            const existingVt = await prisma.visaType.findFirst({
                where: { businessId: business.id, countryId: country.id, name: vtName },
            });
            if (!existingVt) {
                await prisma.visaType.create({
                    data: {
                        businessId: business.id,
                        countryId: country.id,
                        name: vtName,
                        description: `Official ${vtName} processing guidelines and requirements.`,
                    },
                });
            }
        }
    }
    // 5. Sample Client & Applicant
    let sampleClient = await prisma.client.findFirst({
        where: { businessId: business.id, email: 'tariq.khan@example.com' },
    });
    if (!sampleClient) {
        sampleClient = await prisma.client.create({
            data: {
                businessId: business.id,
                clientType: client_1.ClientType.INDIVIDUAL,
                firstName: 'Tariq',
                lastName: 'Khan',
                email: 'tariq.khan@example.com',
                phone: '+92 300 1234567',
                city: 'Lahore',
                country: 'Pakistan',
            },
        });
        const sampleApplicant = await prisma.applicant.create({
            data: {
                businessId: business.id,
                clientId: sampleClient.id,
                firstName: 'Tariq',
                lastName: 'Khan',
                nationality: 'Pakistani',
                passportNumber: 'AB1234567',
                passportExpiryDate: new Date('2029-05-20'),
            },
        });
        const uae = await prisma.country.findFirst({ where: { businessId: business.id, code: 'AE' } });
        const uaeVisa = await prisma.visaType.findFirst({ where: { businessId: business.id, countryId: uae?.id } });
        if (uae && uaeVisa) {
            await prisma.case.create({
                data: {
                    businessId: business.id,
                    clientId: sampleClient.id,
                    applicantId: sampleApplicant.id,
                    countryId: uae.id,
                    visaTypeId: uaeVisa.id,
                    reference: 'GS-202611-0001',
                    status: client_1.CaseStatus.DOCUMENTS_RECEIVED,
                    outcome: client_1.CaseOutcome.PENDING,
                    assignedToId: admin.id,
                },
            });
        }
        console.log('Created sample client, applicant, and case!');
    }
    // 6. Sample Leads
    const existingLead = await prisma.lead.findFirst({ where: { businessId: business.id } });
    if (!existingLead) {
        const uk = await prisma.country.findFirst({ where: { businessId: business.id, code: 'GB' } });
        await prisma.lead.createMany({
            data: [
                {
                    businessId: business.id,
                    firstName: 'Ahmed',
                    lastName: 'Raza',
                    email: 'ahmed.raza@example.com',
                    phone: '+92 321 9876543',
                    source: 'Website Form',
                    stage: client_1.LeadStage.NEW,
                    countryId: uk?.id,
                    purpose: 'Higher Studies in London',
                    assignedToId: admin.id,
                },
                {
                    businessId: business.id,
                    firstName: 'Fatima',
                    lastName: 'Zahra',
                    email: 'fatima.zahra@example.com',
                    phone: '+92 333 5556677',
                    source: 'Referral',
                    stage: client_1.LeadStage.QUALIFIED,
                    purpose: 'Family Visit to UAE',
                    assignedToId: admin.id,
                },
            ],
        });
        console.log('Created sample leads!');
    }
    console.log('✅ Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map