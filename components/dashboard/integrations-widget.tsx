"use client";

import { KeyIcon, LinkIcon, ZapIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

export function IntegrationsWidget() {
    // const integrations = [
    //     {
    //         name: "Discord",
    //         description: "Get notifications in your Discord server",
    //         icon: "🔗",
    //         connected: true
    //     },
    //     {
    //         name: "Twitch",
    //         description: "Connect your Twitch account for streamers",
    //         icon: "🎮",
    //         connected: false
    //     }
    // ];

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Integrations</h2>
            </div>

            <div className="space-y-6">
                {/* API Settings */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <KeyIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">API Access</Label>
                    </div>
                    {/* <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-foreground/80">API Key</p>
                                <p className="text-xs text-foreground/60">
                                    Use this key to access the tip.dev API
                                </p>
                            </div>
                            <Button variant="outline" size="sm">
                                Generate
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-foreground/80">Webhooks</p>
                                <p className="text-xs text-foreground/60">
                                    Receive real-time notifications
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div> */}
                    <p className="text-sm text-foreground/60">Coming soon.</p>
                </div>

                <Separator />

                {/* Third-party Integrations */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <ZapIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">Connected Apps</Label>
                    </div>
                    {/* <div className="space-y-3">
                        {integrations.map((integration) => (
                            <div
                                key={integration.name}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded bg-muted">
                                        <span className="text-lg">{integration.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{integration.name}</p>
                                        <p className="text-xs text-foreground/60">
                                            {integration.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {integration.connected ? (
                                        <>
                                            <Badge
                                                variant="outline"
                                                className="border-green-400 bg-green-400/10 text-green-400"
                                            >
                                                Connected
                                            </Badge>
                                            <Button variant="ghost" size="sm">
                                                Configure
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" size="sm">
                                            Connect
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <p className="text-sm text-foreground/60">More coming soon.</p>
                    </div> */}
                    <p className="text-sm text-foreground/60">Coming soon.</p>
                </div>

                <Separator />

                {/* Zapier Integration */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <LinkIcon className="size-4 text-muted-foreground/60" />
                        <Label className="text-sm font-medium">Automation</Label>
                    </div>
                    {/* <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded bg-orange-100 dark:bg-orange-900/30">
                                <ZapIcon className="size-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Zapier</p>
                                <p className="text-xs text-foreground/60">
                                    Connect tip.dev with 5000+ apps
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLinkIcon className="size-4" />
                            Setup
                        </Button>
                    </div> */}
                    <p className="text-sm text-foreground/60">Coming soon.</p>
                </div>
            </div>
        </div>
    );
}
