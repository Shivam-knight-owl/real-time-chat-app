import { prisma } from "../db";

export const addContact=async (req: any, res: any) => {
    try {
        const { contact_username } = req.body; // extract the contact username i.e B from the request body
        const userId = req.body.userId; // extract the userId of A from the request body which was added by the authenticate middleware

        console.log(`Adding contact: ${contact_username} for user with userId: ${userId}`);

        const contact = await prisma.user.findUnique({ where: { username: contact_username } }); // find the user with the given username B

        if (!contact) {
            return res.status(404).json({ message: "User not found", found: false }); // if user not found return 404
        }

        // Check if contact is already added in contact list of A
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { contacts: true }
        });

        if (user?.contacts.find((c: any) => c.id === contact.id)) {
            return res.status(400).json({ message: "Contact already added", contacts: { "contactuserId": contact.id, "contactName": contact.username }, found: true });
        }

        // update A and add B to the contacts list of A
        await prisma.user.update({
            where: { id: userId },
            data: {
                contacts: {
                    connect: { // connect is used to add a new contact to the contacts list
                        id: contact.id // add B to the contacts list of A
                    }
                }
            }
        });

        // update B and add A to the contacts list of B
        const contactUser = await prisma.user.update({
            where: { id: contact.id },
            data: {
                contacts: {
                    connect: { // connect is used to add a new contact to the contacts list
                        id: userId // add A to the contacts list of B
                    }
                }
            }
        });

        res.status(200).json({ message: "Contact added successfully", contacts: { "contactuserId": contactUser.id, "contactName": contactUser.username }, found: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding contact" });
    }
};