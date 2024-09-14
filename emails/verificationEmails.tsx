
import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from "@react-email/components";

interface verificationEmailProps {
    name: string;
    otp: string;
}

export default function VerificationEmail({ name, otp }: verificationEmailProps) {
    return (
        <Html lang="en" dir="ltr" >
            <Head>
                <title>Verification code</title>
                <Font fontFamily="roboto"
                      fallbackFontFamily="Verdana"
                      webFont={{
                        url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
                        format: "woff2"
                      }}
                      fontWeight={400}
                      fontStyle="normal"
                />

            </Head>
            <Preview>
                Here&apos;s your verification code: {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as="h2"> Hello {name}, </Heading>
                </Row>
                <Row>
                    <Text>
                        Thankyou for registering with uptime-monitoring, Please use the following verification code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>
                        {otp}
                    </Text>
                </Row>
                <Row>
                    <Text>
                        If you did not register, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>

    );
}
