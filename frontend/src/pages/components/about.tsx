
import {Backdrop, Box} from "@mui/material";
import Typography from "@mui/material/Typography";


interface AboutProps {
    open: boolean;
    closeAbout: () => void;
}

export default function About({open, closeAbout}: AboutProps) {
    return (
        <Backdrop
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 2 })}
            open={open}
            onClick={closeAbout}
        >
            <Box display="flex" flexDirection="column" alignItems="center" maxWidth={1000} maxHeight={2000} bgcolor={'background.paper'} borderRadius={8} padding={4}>
                <img src="../../../public/ether-logo.svg" alt="Logo" style={{ width: 468, height: 245, marginBottom: 16, borderRadius: 8}} />
                <Typography variant="h6" padding={2}>EtherTrust is a decentralized peer-to-peer lending platform built on the Ethereum blockchain.
                    Our mission is to provide fair, transparent, and accessible short-term loans for individuals who lack traditional credit options, especially students.
                    By leveraging smart contracts, EtherTrust removes intermediaries, automates loan agreements, and ensures secure, immutable transactions.
                    Whether you’re looking to borrow or lend, EtherTrust empowers users with direct, trustless financial interactions in a user-friendly environment.
                </Typography>
            </Box>
        </Backdrop>

    );
}