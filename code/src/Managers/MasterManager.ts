export default class MasterManager {
    private static lockCommands = false;

    public static SetCommandsLocked(lock: boolean) {
        this.lockCommands = lock;
    }

    public static GetCommandsLocked() {
        return this.lockCommands;
    }
}